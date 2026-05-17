"""
Acquisition Module - Handles digital forensic acquisition
"""
import shutil
import hashlib
import os
import time
import datetime

# Define Project Root (3 levels up from backend/modules/)
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
EVIDENCE_STORAGE = os.path.join(PROJECT_ROOT, "evidence_storage")

class Acquisition:
    """Manages evidence acquisition from various sources"""
    
    def __init__(self):
        self.sources = []
    
    def acquire_from_device(self, device_path, case_id):
        """Acquire evidence from a physical device (Simulated for now)"""
        # In a real scenario, this would use tools like dd or dc3dd
        return {
            "status": "success",
            "message": f"Successfully acquired evidence from {device_path}",
            "case_id": case_id,
            "device": device_path,
            "hash": "SIMULATED_HASH_1234567890" 
        }

    def acquire_logical(self, source_path, case_id):
        """Simulate or perform logical acquisition of a folder/file."""
        start_time = time.time()
        
        if not os.path.exists(source_path):
             return {"status": "error", "message": f"Source path not found: {source_path}"}

        # Destination
        dest_dir = os.path.join(EVIDENCE_STORAGE, case_id, "acquisition")
        os.makedirs(dest_dir, exist_ok=True)
        
        acquired_files = []
        total_size = 0
        
        try:
            if os.path.isfile(source_path):
                filename = os.path.basename(source_path)
                dest_path = os.path.join(dest_dir, filename)
                shutil.copy2(source_path, dest_path)
                file_hash = self.calculate_hash(dest_path)
                acquired_files.append({"file": filename, "hash": file_hash})
                total_size += os.path.getsize(dest_path)
            elif os.path.isdir(source_path):
                # Copy entire directory
                dirname = os.path.basename(source_path)
                dest_path = os.path.join(dest_dir, dirname)
                if os.path.exists(dest_path):
                    shutil.rmtree(dest_path)
                shutil.copytree(source_path, dest_path)
                
                # Manifest Hashing: Hash all files and create a combined hash
                hashes = []
                for root, _, files in os.walk(dest_path):
                    for file in files:
                        f_path = os.path.join(root, file)
                        hashes.append(self.calculate_hash(f_path))
                
                # Sort and hash the hashes for a stable manifest
                manifest_str = "".join(sorted(hashes))
                manifest_hash = hashlib.sha256(manifest_str.encode()).hexdigest()
                acquired_files.append({"dir": dirname, "hash": manifest_hash})

            duration = time.time() - start_time
            
            return {
                "status": "success",
                "message": f"Logical acquisition complete. Copied to {dest_dir}",
                "case_id": case_id,
                "source": source_path,
                "duration_seconds": round(duration, 2),
                "timestamp": datetime.datetime.now().isoformat(),
                # If single file, return its hash. If folder, maybe a manifest hash? 
                # Let's return a specific hash if single file, else a placeholder.
                "hash": acquired_files[0]['hash'] if acquired_files else "DIR_HASH_SIMULATED",
                "type": "logical"
            }
            
        except Exception as e:
            return {"status": "error", "message": str(e)}
    
    def acquire_from_image(self, image_path):
        """Acquire evidence from a disk image"""
        pass
    
    def validate_acquisition(self, acquisition_data):
        """Validate the integrity of acquired data"""
        pass

    def calculate_hash(self, filepath):
        """Calculate SHA256 hash of a file"""
        sha256_hash = hashlib.sha256()
        with open(filepath, "rb") as f:
            for byte_block in iter(lambda: f.read(4096), b""):
                sha256_hash.update(byte_block)
        return sha256_hash.hexdigest()

# Create a global instance to be used by app.py
acquisition_manager = Acquisition()
