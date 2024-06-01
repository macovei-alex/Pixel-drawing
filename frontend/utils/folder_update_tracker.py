import subprocess
import time
import os
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler


class ChangeHandler(FileSystemEventHandler):
    def __init__(self, script_path: str, min_interval: float):
        super().__init__()
        self.script_path = script_path
        self.min_interval = min_interval
        self.last_modification = time.time()

    def on_modified(self, event) -> None:
        if not event.is_directory:
            self.handle_event('File modified', event.src_path)

    def on_created(self, event) -> None:
        if not event.is_directory:
            self.handle_event('File created', event.src_path)

    def on_deleted(self, event) -> None:
        if not event.is_directory:
            self.handle_event('File deleted', event.src_path)

    def handle_event(self, event_name: str, parameter_name: str) -> None:
        if event_name != 'File modified':
            return
        if self.check_handle_event():
            print(f'{event_name}: {parameter_name}')
            print(f'Executing script: {self.script_path}')
            self.last_modification = time.time()
            subprocess.run(['python', self.script_path])
            print()

    def check_handle_event(self) -> bool:
        if self.last_modification + self.min_interval > time.time():
            return False
        return True


def monitor_folder(path_to_watch: str):
    event_handler = ChangeHandler('utils\\bundle_files.py', 0.5)
    observer = Observer()
    observer.schedule(event_handler, path=path_to_watch, recursive=False)
    observer.start()
    try:
        while True:
            time.sleep(10)
    except KeyboardInterrupt:
        print('Monitoring stopped')
        observer.stop()
    observer.join()


while not os.path.exists("frontend\\src"):
    os.chdir("..")
os.chdir("frontend")
folder_path: str = os.path.abspath('src')
print()
print(f'Monitoring changes in folder: {folder_path}')
monitor_folder(folder_path)
