import sys
import json

def ordered(obj):
  if isinstance(obj, dict):
    return sorted((k, ordered(v)) for k, v in obj.items())
  if isinstance(obj, list):
    return sorted(ordered(x) for x in obj)
  else:
    return obj

def same_json(a, b): return ordered(a) == ordered(b)

def read_json(file):
  with open(file, 'r') as file:
      data = json.load(file)
  return data

def main():
    if len(sys.argv) > 2:
        file_name1 = sys.argv[1]
        file_name2 = sys.argv[2]
        print(same_json(read_json(file_name1), read_json(file_name2)))
    else:
        print("No input file names: a and b")

if __name__ == "__main__":
  main()