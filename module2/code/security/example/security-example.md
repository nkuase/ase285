smcho@mac server> gpg --import RPM-GPG-KEY-mysql-2023
gpg: key B7B3B788A8D3785C: public key "MySQL Release Engineering <mysql-build@oss.oracle.com>" imported
gpg: Total number processed: 1
gpg:               imported: 1

smcho@mac server> gpg --fingerprint "MySQL Release Engineering"
pub   rsa4096 2023-10-23 [SC]
      BCA4 3417 C3B4 85DD 128E  C6D4 B7B3 B788 A8D3 785C
uid           MySQL Release Engineering <mysql-build@oss.oracle.com>

gpg --verify mysql-8.4.2.tar.xz.asc

Signature made Wed 02 Oct 2025 ...  
If that’s before expiration, it’s fine.

gpg --verify mysql-8.4.2-linux-glibc2.28-x86_64.tar.xz.asc \
    mysql-8.4.2-linux-glibc2.28-x86_64.tar.xz

gpg: Signature made Wed Oct  2 12:33:14 2025 EDT
gpg:                using RSA key BCA43417C3B485DD128EC6D4B7B3B788A8D3785C
gpg: Good signature from "MySQL Release Engineering <mysql-build@oss.oracle.com>" [expired]

1. We use Oracle's public key to very that the signature is authentic.
2. The signature has the hash of the zip file, and we can calculate the hash to check the match.
3. So, we need two more files (public key & signatuare) to verify the file is authentic and not coompromised.


gpg --armor --output file.txt.asc --detach-sign file.txt

smcho@mac .gnupg> ls -alF
-rw-r-----    1 smcho  staff    12 Feb 22  2024 common.conf
drwx------    3 smcho  staff    96 Feb 22  2024 openpgp-revocs.d/
drwx------    4 smcho  staff   128 Feb 22  2024 private-keys-v1.d/
drwxr-x---    5 smcho  staff   160 Nov  8 19:45 public-keys.d/
srwx------    1 smcho  staff     0 Nov  8 19:45 S.gpg-agent=
srwx------    1 smcho  staff     0 Nov  8 19:45 S.gpg-agent.browser=
srwx------    1 smcho  staff     0 Nov  8 19:45 S.gpg-agent.extra=
srwx------    1 smcho  staff     0 Nov  8 19:45 S.gpg-agent.ssh=
srwx------    1 smcho  staff     0 Nov  8 19:45 S.keyboxd=
srwx------    1 smcho  staff     0 Nov  8 19:45 S.scdaemon=
-rw-------    1 smcho  staff  1280 Feb 29  2024 trustdb.gpg

smcho@mac .gnupg> gpg --list-secret-keys
[keyboxd]
---------
sec   ed25519 2024-02-23 [SC] [expires: 2027-02-22]
      3B2765DD8767BA1892116F822CDC6A6416579B1E
uid           [ultimate] smcho <chos5@nku.edu>
ssb   cv25519 2024-02-23 [E] [expires: 2027-02-22]

Select the default key when you have multiple ones.

gpg --default-key 1234ABCD5678EF9012345678ABCD1234567890EF --detach-sign file.txt