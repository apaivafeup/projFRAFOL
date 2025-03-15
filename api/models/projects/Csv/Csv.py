from models.Project import Project

class Csv(Project):
    def __init__(self, version, tool):
        super().__init__("Csv", version, tool)
        self.available_versions = ["4", "9", "27"]

def make_Csv(version, tool):
    return Csv(version, tool)
