from models.Project import Project

class Mockito(Project):
    def __init__(self, version, tool):
        super().__init__("Mockito", version, tool)
        self.available_versions = ["1", "5", "7"]

def make_mockito(version, tool):
    return Mockito(version, tool)
