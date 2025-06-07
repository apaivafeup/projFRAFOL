from models.projects.Cli.Cli import make_cli
from models.projects.Gson.Gson import make_gson
from models.projects.Lang.Lang import make_lang
from models.projects.Jsoup.Jsoup import make_jsoup
from models.projects.Compress.Compress import make_compress
from models.projects.Math.Math import make_math
from models.projects.Mockito.Mockito import make_mockito
from models.projects.Csv.Csv import make_Csv


def make_project(project_name, version = 0, tool = None):
    """
    Factory method to create a Project object based on the given project name.

    :param project_name: The name of the project ("cli", "gson", or "lang")
    :param version: The version of the project to use
    :param tool: The tool to use for the project
    :return: An instance of the corresponding Project subclass
    """
    if project_name.lower() == "cli":
        return make_cli(version, tool)
    elif project_name.lower() == "gson":
        return make_gson(version, tool)
    elif project_name.lower() == "lang":
        return make_lang(version, tool)
    elif project_name.lower() == "jsoup":
        return make_jsoup(version, tool)
    elif project_name.lower() == "compress":
        return make_compress(version, tool)
    elif project_name.lower() == "math":
        return make_math(version, tool)
    elif project_name.lower() == "mockito":
        return make_mockito(version, tool)
    elif project_name.lower() == "csv":
        return make_Csv(version, tool)
    else:
        raise ValueError(f"Unknown project name: {project_name}")