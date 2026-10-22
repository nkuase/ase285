#!/usr/bin/env bash
# Run the steps one at a time, in order: step1 -> step2 -> step3 -> step4 -> step5.
#
# All steps use the same port (5500), so only one step runs at a time.
# Press Ctrl+C to stop the current step, then press Enter to start the next one.
#
#   ./run.sh              start from step1 and continue in order
#   ./run.sh 3            start from step3 and continue in order (step3 -> step4 -> step5)
#   ./run.sh 3 --only     run only step3
#   ./run.sh install      run "npm install" in every step
#
# Environment:
#   PORT=5600 ./run.sh    use another port (default: 5500)
#   NO_INSTALL=1          skip "npm install" even if node_modules is missing

set -u

ROOT="$(cd "$(dirname "$0")" && pwd)"
PORT="${PORT:-5500}"
LAST=5

TITLES=(
  "Simplistic Todo App (native MongoDB driver)"
  "Todo App with Mongoose ODM"
  "Todo App with REST API (separated routes)"
  "Todo App with SQLite"
  "Database abstraction layer (ORDB)"
)

usage() {
  sed -n '2,13p' "$0" | sed 's/^# \{0,1\}//'
  exit 1
}

install_step() {
  local step="$1"
  if [ "${NO_INSTALL:-0}" = "1" ]; then return 0; fi
  if [ ! -d "$ROOT/$step/node_modules" ]; then
    echo "[$step] npm install ..."
    (cd "$ROOT/$step" && npm install --no-audit --no-fund --loglevel=error) || return 1
  fi
}

# step1-3 read code/.env, step4 needs none, step5 reads its own .env
check_env() {
  case "$1" in
    step1|step2|step3)
      if [ ! -f "$ROOT/.env" ]; then
        echo "Missing $ROOT/.env (copy .env.example to .env and fill it in)."
        return 1
      fi
      ;;
    step5)
      if [ ! -f "$ROOT/step5/.env" ]; then
        echo "Missing $ROOT/step5/.env (copy step5/.env.example to step5/.env)."
        return 1
      fi
      ;;
  esac
}

run_step() {
  local n="$1"
  local step="step$n"

  echo
  echo "=============================================================="
  echo " $step: ${TITLES[$((n - 1))]}"
  echo " http://localhost:$PORT   (Ctrl+C to stop)"
  echo "=============================================================="

  check_env "$step" || return 1
  install_step "$step" || { echo "[$step] npm install failed"; return 1; }

  (cd "$ROOT/$step" && PORT="$PORT" npm start)
}

# ------------------------------------------------------------------ main
if [ "${1:-}" = "install" ]; then
  for n in $(seq 1 "$LAST"); do
    NO_INSTALL=0 install_step "step$n" || echo "[step$n] npm install failed"
  done
  exit 0
fi

start="${1:-1}"
start="${start#step}"
only=0
[ "${2:-}" = "--only" ] && only=1

case "$start" in
  [1-5]) ;;
  *) usage ;;
esac

# Keep this script alive when Ctrl+C stops the running step.
trap ':' INT

n="$start"
while [ "$n" -le "$LAST" ]; do
  run_step "$n"
  echo
  echo "step$n stopped."

  [ "$only" -eq 1 ] && break
  [ "$n" -eq "$LAST" ] && break

  answer=""
  read -r -p "Next: step$((n + 1)) - ${TITLES[$n]}. Press Enter to continue, q to quit: " answer || answer="q"
  case "$answer" in
    q|Q) break ;;
  esac

  n=$((n + 1))
done

echo "Done."
