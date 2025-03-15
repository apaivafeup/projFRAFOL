from models.Project import Project

class Jsoup(Project):
    def __init__(self, version, tool):
        super().__init__("Jsoup", version, tool)
        self.available_versions = ["4", "9", "27"]

def make_jsoup(version, tool):
    return Jsoup(version, tool)
