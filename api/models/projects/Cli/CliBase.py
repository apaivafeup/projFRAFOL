
from models.Project import Project

class Cli(Project):
    def __init__(self, version = 0, tool = None):
        super().__init__("Cli", version, tool)
        self.available_versions = ["32"]