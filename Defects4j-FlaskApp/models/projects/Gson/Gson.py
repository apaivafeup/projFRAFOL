from models.Project import Project

class Gson(Project):
    def __init__(self, version, tool):
        super().__init__("Gson", version, tool)
        self.available_versions = ["15"]

def make_gson(version, tool):
    return Gson(version, tool)
