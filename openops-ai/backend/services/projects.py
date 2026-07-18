import io
import shutil
import uuid
import zipfile
from pathlib import Path, PurePosixPath

from models.project import ProjectResponse, TreeNode

PROJECT_ROOT = Path(__file__).resolve().parents[2] / "uploads"
IGNORED_DIRECTORIES = {".git", "node_modules", ".terraform", "venv", ".venv", "__pycache__"}
MAX_ARCHIVE_BYTES = 50 * 1024 * 1024
MAX_EXTRACTED_FILES = 2_000
MAX_EXTRACTED_BYTES = 200 * 1024 * 1024


def create_project_from_zip(filename: str, content: bytes) -> ProjectResponse:
    if len(content) > MAX_ARCHIVE_BYTES:
        raise ValueError("The archive must be smaller than 50 MB.")

    project_id = uuid.uuid4().hex
    destination = PROJECT_ROOT / project_id
    destination.mkdir(parents=True, exist_ok=False)

    try:
        with zipfile.ZipFile(io.BytesIO(content)) as archive:
            members = [item for item in archive.infolist() if _should_extract(item)]
            if len(members) > MAX_EXTRACTED_FILES:
                raise ValueError("The archive contains too many files (maximum: 2,000).")
            if sum(item.file_size for item in members) > MAX_EXTRACTED_BYTES:
                raise ValueError("The extracted project would be too large (maximum: 200 MB).")
            for item in members:
                target = (destination / PurePosixPath(item.filename)).resolve()
                if not target.is_relative_to(destination.resolve()):
                    raise ValueError("The archive contains an unsafe file path.")
                target.parent.mkdir(parents=True, exist_ok=True)
                if not item.is_dir():
                    with archive.open(item) as source, target.open("wb") as output:
                        shutil.copyfileobj(source, output)
    except (zipfile.BadZipFile, OSError) as error:
        shutil.rmtree(destination, ignore_errors=True)
        raise ValueError("The uploaded file is not a valid ZIP archive.") from error
    except Exception:
        shutil.rmtree(destination, ignore_errors=True)
        raise

    return ProjectResponse(id=project_id, name=Path(filename).stem, tree=_tree(destination))


def _should_extract(item: zipfile.ZipInfo) -> bool:
    path = PurePosixPath(item.filename)
    parts = path.parts
    return not item.is_dir() and not path.is_absolute() and ".." not in parts and not any(part in IGNORED_DIRECTORIES for part in parts)


def _tree(directory: Path, root: Path | None = None) -> list[TreeNode]:
    root = root or directory
    nodes = []
    for entry in sorted(directory.iterdir(), key=lambda path: (path.is_file(), path.name.lower())):
        relative_path = entry.relative_to(root).as_posix()
        if entry.is_dir():
            nodes.append(TreeNode(name=entry.name, path=relative_path, type="directory", children=_tree(entry, root)))
        else:
            nodes.append(TreeNode(name=entry.name, path=relative_path, type="file"))
    return nodes
