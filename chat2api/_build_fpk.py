"""Build chat2api.fpk from app/ directory"""
import tarfile, os, io

BUILD_DIR = r'D:\workspace\RTS-reference\chat2api-fpk-build'
APP_DIR = os.path.join(BUILD_DIR, 'app')
APP_TGZ = os.path.join(BUILD_DIR, 'app.tgz')
FPK_FILE = os.path.join(BUILD_DIR, 'chat2api.fpk')

def build_app_tgz():
    """Create app.tgz from the app/ directory (tar.gz)"""
    print('Building app.tgz...')
    with tarfile.open(APP_TGZ, 'w:gz') as tgz:
        for root, dirs, files in os.walk(APP_DIR):
            for fname in files:
                full_path = os.path.join(root, fname)
                arcname = os.path.relpath(full_path, os.path.dirname(APP_DIR))
                tgz.add(full_path, arcname)
                print(f'  + {arcname} ({os.path.getsize(full_path)} bytes)')
    print(f'  -> {os.path.getsize(APP_TGZ)} bytes')

def build_fpk():
    """Create final chat2api.fpk tar.gz"""
    print('Building chat2api.fpk...')
    
    # Include list: root-level files/dirs
    includes = [
        'app.tgz',
        'config',
        'cmd',
        'ICON.PNG',
        'ICON_256.PNG',
        'manifest',
        'ui',
        'wizard',
        'www',
    ]
    
    with tarfile.open(FPK_FILE, 'w:gz') as fpk:
        for name in includes:
            path = os.path.join(BUILD_DIR, name)
            if os.path.exists(path):
                fpk.add(path, name)
                size = os.path.getsize(path) if os.path.isfile(path) else 0
                print(f'  + {name} ({size if size else "dir"} bytes)')
            else:
                print(f'  - {name} (not found, skipped)')
    print(f'  -> {os.path.getsize(FPK_FILE)} bytes')

if __name__ == '__main__':
    # Step 1: rebuild app.tgz
    if os.path.exists(APP_TGZ):
        old_size = os.path.getsize(APP_TGZ)
        os.remove(APP_TGZ)
        print(f'Removed old app.tgz ({old_size} bytes)')
    
    build_app_tgz()
    
    # Step 2: rebuild fpk
    if os.path.exists(FPK_FILE):
        old_size = os.path.getsize(FPK_FILE)
        os.remove(FPK_FILE)
        print(f'Removed old chat2api.fpk ({old_size} bytes)')
    
    build_fpk()
    print('\nBUILD COMPLETE')
