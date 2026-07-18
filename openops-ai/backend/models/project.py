from pydantic import BaseModel


class TreeNode(BaseModel):
    name: str
    path: str
    type: str
    children: list["TreeNode"] = []


class ProjectResponse(BaseModel):
    id: str
    name: str
    tree: list[TreeNode]
