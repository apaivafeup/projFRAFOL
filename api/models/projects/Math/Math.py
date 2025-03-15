from models.Project import Project

class Math(Project):
    def __init__(self, version, tool):
        super().__init__("Math", version, tool)
        self.available_versions = ["90"]

def make_math(version, tool):
    return Math(version, tool)
