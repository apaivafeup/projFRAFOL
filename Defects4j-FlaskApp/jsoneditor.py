import json

def save_checked_out_project(project, version):
    with open("checked_out_projects.json") as imported_projects:
        data = json.load(imported_projects)

    project_name_version = project + "-" + version

    project_exists = False
    for item in data:
        if item.get("name") == project_name_version:
            project_exists = True
            break

    if not project_exists:
        data.append({
            "name": project_name_version,
        })

    with open("checked_out_projects.json", 'w') as json_file:
        json.dump(data, json_file, indent=4, separators=(',', ': '))

def wipe_checked_out_projects_file():
    with open("checked_out_projects.json", 'w') as json_file:
        json.dump([], json_file, indent=4, separators=(',', ': '))
        

def save_imported_project_in_json(project, metric_data = None, coverage_data = None, total_mutants = None):
    with open("data.json") as imported_projects:
        data = json.load(imported_projects)

    project_exists = False
    for item in data:
        if item.get("name") == project:
            item["metric_data"] = metric_data if metric_data is not None else []
            item["coverage_data"] = coverage_data if coverage_data is not None else []
            item["total_mutants"] = total_mutants if total_mutants is not None else 0
            project_exists = True
            break

    if not project_exists:
        data.append({
            "name": project,
            "metric_data" : metric_data if metric_data is not None else [],
            "coverage_data" : coverage_data if coverage_data is not None else [],
            "total_mutants" : total_mutants if total_mutants is not None else 0
        })

    with open("data.json", 'w') as json_file:
        json.dump(data, json_file, indent=4, separators=(',', ': '))



def read_imported_project_from_json(project):
    """
    Reads the imported project data from the data.json file.

    :param project: The name of the project
    :param version: The version of the project
    :return: A dictionary containing the project's data if it exists, otherwise None
    """
    project_name_version = project

    try:
        with open("data.json", 'r') as json_file:
            data = json.load(json_file)

        for item in data:
            if item.get("name") == project_name_version:
                return item

        print(f"Project {project_name_version} not found in data.json")
        return None

    except FileNotFoundError:
        print("data.json file not found")
        return None
    except json.JSONDecodeError:
        print("Error decoding JSON from data.json")
        return None
