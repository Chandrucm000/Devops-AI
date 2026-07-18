import io
import zipfile

from services.projects import create_project_from_zip


def test_zip_upload_extracts_files_and_ignores_noise(tmp_path, monkeypatch):
    monkeypatch.setattr("services.projects.PROJECT_ROOT", tmp_path)
    archive = io.BytesIO()
    with zipfile.ZipFile(archive, "w") as zip_file:
        zip_file.writestr("demo/main.tf", "resource \\\"aws_s3_bucket\\\" \\\"logs\\\" {}")
        zip_file.writestr("demo/node_modules/ignored.js", "ignored")
    project = create_project_from_zip("demo.zip", archive.getvalue())
    assert project.name == "demo"
    assert project.tree[0].name == "demo"
    assert project.tree[0].children[0].name == "main.tf"
