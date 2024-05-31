import subprocess
import time
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
            self.handle_event("File modified")

    def on_created(self, event) -> None:
        if not event.is_directory:
            self.handle_event("File created")

    def on_deleted(self, event) -> None:
        if not event.is_directory:
            self.handle_event("File deleted")

    def handle_event(self, event_name: str) -> None:
        if event_name != 'File modified':
            return
        if self.check_handle_event():
            print(event_name)
            print(f"Executing script: {self.script_path}")
            self.last_modification = time.time()
            subprocess.run(["python", self.script_path])

    def check_handle_event(self) -> bool:
        if self.last_modification + self.min_interval < time.time():
            return True
        return False


def monitor_folder(path_to_watch: str):
    event_handler = ChangeHandler('bundle_files.py', 0.5)
    observer = Observer()
    observer.schedule(event_handler, path=path_to_watch, recursive=False)
    observer.start()
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()


if __name__ == "__main__":
    path = "..\\src"  # Monitor the current directory. Change this to the path you want to monitor.
    print(f"Monitoring changes in folder: {path}")
    monitor_folder(path)
