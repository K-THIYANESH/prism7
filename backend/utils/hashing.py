"""
Hashing Utilities - Cryptographic hash functions for evidence integrity
"""

import hashlib
import hmac

def calculate_md5(file_path):
    """Calculate MD5 hash of a file"""
    hash_md5 = hashlib.md5()
    with open(file_path, "rb") as f:
        for chunk in iter(lambda: f.read(4096), b""):
            hash_md5.update(chunk)
    return hash_md5.hexdigest()

def calculate_sha256(file_path):
    """Calculate SHA256 hash of a file"""
    hash_sha256 = hashlib.sha256()
    with open(file_path, "rb") as f:
        for chunk in iter(lambda: f.read(4096), b""):
            hash_sha256.update(chunk)
    return hash_sha256.hexdigest()

def calculate_sha1(file_path):
    """Calculate SHA1 hash of a file"""
    hash_sha1 = hashlib.sha1()
    with open(file_path, "rb") as f:
        for chunk in iter(lambda: f.read(4096), b""):
            hash_sha1.update(chunk)
    return hash_sha1.hexdigest()

def verify_hash(file_path, expected_hash, algorithm='sha256'):
    """Verify file hash against expected value"""
    if algorithm == 'md5':
        calculated = calculate_md5(file_path)
    elif algorithm == 'sha1':
        calculated = calculate_sha1(file_path)
    else:
        calculated = calculate_sha256(file_path)
    
    return hmac.compare_digest(calculated, expected_hash)
