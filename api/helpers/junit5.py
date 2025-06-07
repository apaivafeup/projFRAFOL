from lxml import etree as ET

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
