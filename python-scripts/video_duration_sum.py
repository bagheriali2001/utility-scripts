import os
import subprocess
from datetime import timedelta
from rich.console import Console
from rich.tree import Tree

VIDEO_EXTENSIONS = ('.mp4', '.mov', '.avi', '.mkv', '.flv', '.wmv')
console = Console()

def get_video_duration(filepath):
    try:
        result = subprocess.run(
            ['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries',
             'format=duration', '-of', 'default=noprint_wrappers=1:nokey=1', filepath],
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True
        )
        return float(result.stdout.strip())
    except Exception as e:
        console.print(f"[red]Error reading {filepath}: {e}[/red]")
        return 0

def format_duration(seconds):
    return str(timedelta(seconds=int(seconds)))

def scan_folder_tree(base_path):
    folder_tree = {}
    grand_total = 0

    for root, _, files in os.walk(base_path):
        rel_root = os.path.relpath(root, base_path)
        folder_total = 0
        video_files = []

        sorted_files = sorted(files, key=lambda x: x.lower())

        for file in sorted_files:
            if file.lower().endswith(VIDEO_EXTENSIONS):
                filepath = os.path.join(root, file)
                duration = get_video_duration(filepath)
                folder_total += duration
                video_files.append((file, duration))

        if folder_total > 0:
            folder_tree[rel_root] = (video_files, folder_total)
            grand_total += folder_total

    return folder_tree, grand_total

def display_tree(folder_tree, base_path, grand_total):
    tree = Tree(f"[bold green]{os.path.basename(base_path)}[/bold green]")

    sorted_folders = sorted(folder_tree.items(), key=lambda x: x[0])
    for folder, (files, folder_total) in sorted_folders:
        sub_tree = tree
        if folder != ".":
            folder_parts = folder.split(os.sep)
            for part in folder_parts:
                existing = next((b for b in sub_tree.children if b.label == part), None)
                sub_tree = existing if existing else sub_tree.add(part)

            folder_label = f"{folder} — [bold yellow]{format_duration(folder_total)}[/bold yellow]"
            sub_tree.label = folder_label

        for file, duration in files:
            sub_tree.add(f"{file} — {format_duration(duration)}")

    console.print(tree)
    console.print(f"\n[bold cyan]Total Duration of All Videos:[/bold cyan] {format_duration(grand_total)}")

if __name__ == "__main__":
    import sys
    if len(sys.argv) < 2:
        print("Usage: python video_duration_sum.py <folder_path>")
    else:
        base_path = sys.argv[1]
        folder_tree, grand_total = scan_folder_tree(base_path)
        display_tree(folder_tree, base_path, grand_total)
