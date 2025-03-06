from flask import Flask, request, jsonify
from flask_cors import CORS
from lxml import etree as ET

import projectmanager as pm
import jsoneditor as je
from helpers import file_helper, kill_matrix, file_paths
from models.projects.factory import make_project
from models.tools.factory import make_tool
from models.Project import Project




app = Flask(__name__)
app.secret_key = "e60OMnoWrQaHjlz"

# CORS Configuration
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)
app.config['CORS_HEADERS'] = 'Content-Type'

je.wipe_checked_out_projects()

avaliable_projects = ['Cli', 'Gson', 'Lang', 'Jsoup', 'Math', 'Compress']

def file_data(path):
    data = str()
    with open(path, encoding='utf-8') as f:
        data = f.read()

    return data

def save_testsuite(data):
    file = open(file_paths.student_test_file_path, "w")
    file.write(data)
    file.close()


def add_junit5_to_maven_build(project):
    print('adding JUnit5 dependency to maven-build.xml...')
    build_xml_path = "/root/" + project + "/maven-build.xml"
    
    parser = ET.XMLParser(remove_blank_text=True)
    tree = ET.parse(build_xml_path, parser)
    root = tree.getroot()
    
    # Define the JUnit 5 dependencies
    junit5_dependencies = [
        {
            'groupId': 'org.junit.jupiter',
            'artifactId': 'junit-jupiter-api',
            'version': '5.8.2',
            'scope': 'test'
        },
        {
            'groupId': 'org.junit.jupiter',
            'artifactId': 'junit-jupiter-engine',
            'version': '5.8.2',
            'scope': 'test'
        },
        {
            'groupId': 'org.junit.vintage',
            'artifactId': 'junit-vintage-engine',
            'version': '5.8.2',
            'scope': 'test'
        }
    ]
    
    # Find or create the get-deps target
    nsmap = root.nsmap
    get_deps_target = root.find('.//target[@name="get-deps"]')
    if get_deps_target is None:
        get_deps_target = ET.SubElement(root, 'target', name="get-deps", depends="test-offline", description="Download all dependencies", unless="maven.mode.offline")
    
    # Add JUnit 5 dependencies to the get-deps target
    for dep in junit5_dependencies:
        mkdir_dir = "${maven.repo.local}/" + dep['groupId'].replace('.', '/') + "/" + dep['artifactId'] + "/" + dep['version']
        get_src = "https://repo.maven.apache.org/maven2/" + dep['groupId'].replace('.', '/') + "/" + dep['artifactId'] + "/" + dep['version'] + "/" + dep['artifactId'] + "-" + dep['version'] + ".jar"
        get_dest = mkdir_dir + "/" + dep['artifactId'] + "-" + dep['version'] + ".jar"
        
        ET.SubElement(get_deps_target, 'mkdir', dir=mkdir_dir)
        ET.SubElement(get_deps_target, 'get', src=get_src, dest=get_dest, usetimestamp="false", ignoreerrors="true")
    
    # Write the changes back to the maven-build.xml file
    tree.write(build_xml_path, pretty_print=True, xml_declaration=True, encoding='UTF-8')
    print(f"JUnit5 dependencies added to {build_xml_path}")

def add_junit5_to_pom(project):
    print('adding JUnit5 dependency to pom...')
    pompath = "/root/" + project + "/pom.xml"
    
    parser = ET.XMLParser(remove_blank_text=True)
    tree = ET.parse(pompath, parser)
    root = tree.getroot()
    
    # Define the JUnit 5 dependencies
    junit5_dependencies = [
        {
            'groupId': 'org.junit.jupiter',
            'artifactId': 'junit-jupiter-api',
            'version': '5.8.2',
            'scope': 'test'
        },
        {
            'groupId': 'org.junit.jupiter',
            'artifactId': 'junit-jupiter-engine',
            'version': '5.8.2',
            'scope': 'test'
        },
        {
            'groupId': 'org.junit.vintage',
            'artifactId': 'junit-vintage-engine',
            'version': '5.8.2',
            'scope': 'test'
        }
    ]
    
    # Define the JUnit 4 dependency
    junit4_dependency = {
        'groupId': 'junit',
        'artifactId': 'junit',
        'version': '4.13.2',
        'scope': 'test'
    }
    
    # Find or create the dependencies element
    nsmap = root.nsmap
    dependencies = root.find('.//{%s}dependencies' % nsmap[None])
    if dependencies is None:
        dependencies = ET.SubElement(root, 'dependencies')
    
    # Check if JUnit 4 dependency is already present
    junit4_present = False
    for dependency in dependencies.findall('{%s}dependency' % nsmap[None]):
        groupId = dependency.find('{%s}groupId' % nsmap[None]).text
        artifactId = dependency.find('{%s}artifactId' % nsmap[None]).text
        version = dependency.find('{%s}version' % nsmap[None]).text
        if groupId == 'junit' and artifactId == 'junit' and version.startswith('4.'):
            junit4_present = True
            break
    
    # Add JUnit 4 dependency if not present
    if not junit4_present:
        dependency = ET.Element('dependency')
        for key, value in junit4_dependency.items():
            element = ET.SubElement(dependency, key)
            element.text = value
        dependencies.append(dependency)
    
    # Add JUnit 5 dependencies
    for dep in junit5_dependencies:
        dependency = ET.Element('dependency')
        for key, value in dep.items():
            element = ET.SubElement(dependency, key)
            element.text = value
        dependencies.append(dependency)
    
    # Write the changes back to the pom.xml file
    tree.write(pompath, pretty_print=True, xml_declaration=True, encoding='UTF-8')


@app.route('/get_avaliable_projects', methods=['GET'])
def get_avaliable_projects():
    return jsonify({'projects_to_import' : avaliable_projects, 'projects_to_open': pm.get_opened_projects()}), 200  

@app.route('/project_versions', methods=['post'])
def project_versions():
    data = request.json
    versions = make_project(data['project']).available_versions

    return jsonify({'versions': versions}), 200


@app.route('/import_project', methods=['POST'])
def import_project():
    new_import_project = request.json
    project_name = new_import_project['project']
    version = new_import_project['version']

    imported_project: Project = make_project(project_name, version)
    imported_project.checkout_with_defects4j()
    imported_project.compile_with_defects4j()

    #add_junit5_to_pom(projectWithVersion + "f")
    #add_junit5_to_maven_build(projectWithVersion + "f")

    
               
    return jsonify({'projects_to_open': pm.get_opened_projects() }), 200

@app.route('/open_project', methods=['POST'])
def load_project():
    data = request.json
    project = data['project']
    tool = data['tool']

    project_name, version = project.split("-")
    opened_project : Project = make_project(project_name, version, make_tool(tool))

    path = opened_project.get_class_path()
    test_class = file_data(path)

    dev_suite = file_helper.read_file_if_exists("tmp/" + project + "/dev.java")
    if dev_suite is None:
        path = opened_project.get_devsuite_path()
        dev_suite = file_data(path)
        file_helper.write_to_file(dev_suite, "tmp/" + project + "/dev.java")

    table_header = opened_project.get_mutant_table_headers()
    metric_data, coverage_data = opened_project.get_project_data()

    return jsonify({
        'project': project,
        'tool': tool,
        'table_header': table_header,
        'metric_data': metric_data,
        'summary_data': ['0', '0', '0', '0'],
        'test_class': test_class,
        'dev_suite': dev_suite,
        'coverage_data': coverage_data
    }), 200

@app.route('/compile', methods=['post'])
def compile():
    data = request.json
    project = data['project']

    save_testsuite(data['code'])

    project_name, version = project.split("-")
    project: Project = make_project(project_name, version)

    return project.compile()

@app.route('/analyze_mutants', methods=['post'])
def generate_mutants():
    data = request.json
    project = data['project']
    tool = data['tool']
    with_student_tests = data['withStudentTests']

    project_name, version = project.split("-")
    project: Project = make_project(project_name, version, make_tool(tool))


    if with_student_tests:
        save_testsuite(data['code'])
    else:
        is_not_first_mutations_analysis = project.is_dev_suite_mutated()
        if is_not_first_mutations_analysis:
            return jsonify({'message': 'Skipping analysis - already performed.'}), 204
    
    sheet_data, table_header, killed_list = project.analyze_mutants(with_student_tests)
    summary_data = project.get_project_mutation_summary()

    return jsonify({
        'table_header': table_header,
        'sheet_data': sheet_data,
        'killed_list': killed_list,
        'summary_data': summary_data,
    }), 200

@app.route('/generate_kill_matrix', methods=['post'])
def generate_kill_matrix():
    data = request.json
    project = data['project']
    tool = data['tool']

    project_name, version = project.split("-")
    tool = make_tool(tool)
    project: Project = make_project(project_name, version, tool)

    save_testsuite(data['code'])
    matrix, all_killed_mutants = kill_matrix.generate_kill_matrix(project, tool)

    return jsonify({
        'kill_matrix': matrix,
        "all_killed_mutants" : all_killed_mutants,
    }), 200



if (__name__ == '__main__'):
    app.run(host='0.0.0.0', port=int('8000'), debug=True)