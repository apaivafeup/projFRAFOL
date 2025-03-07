import { CodeEditor } from "@components/CodeEditor";
import { Modal } from "@mui/material";

interface HelpModalViewProps {
    open: boolean;
    setOpen: (value: boolean) => void;
    }

function HelpModalView( {open, setOpen}: HelpModalViewProps) {

  const goodExampleCode = `
public class StudentTest extends TestCase {

 // ✅ few static variables and setup code
  private static final long MILLIS_TEST;
  static {
    GregorianCalendar cal = new GregorianCalendar(2000, 6, 5, 4, 3, 2);
    cal.set(Calendar.MILLISECOND, 1);
    MILLIS_TEST = cal.getTime().getTime();
  }


  public void test_f6af4c5c() throws Exception {
  // ✅ instantiating variables inside the test method to reduce outer method calls
    dateTimeParser = new SimpleDateFormat("MMM dd, yyyy H:mm:ss.SSS", Locale.ENGLISH);

    Date date = dateTimeParser.parse("October 29, 2020 6:00:00.000");
    try {
      date = DateUtils.round(date, DateUtils.SEMI_MONTH);
    } catch (IllegalArgumentException ex) {}
    
    // ✅ assert inside the test method
    assertEquals(...);
  }
}
`;

  const badExampleCode = `
public class StudentTest extends TestCase {

// ❌ lots of static variables and setup code 
  private static final long MILLIS_TEST;
  static {
    GregorianCalendar cal = new GregorianCalendar(2000, 6, 5, 4, 3, 2);
    cal.set(Calendar.MILLISECOND, 1);
    MILLIS_TEST = cal.getTime().getTime();
  }

  DateFormat dateParser = null;
  DateFormat dateTimeParser = null;
  DateFormat timeZoneDateParser = null;

// ❌ unnecessary constructors and methods
  public StudentTest(String name) {
    super(name);
  }

  public static void main(String[] args) {
    TestRunner.run(suite());
  }

  public static Test suite() {
    TestSuite suite = new TestSuite(StudentTest.class);
    return suite;
  }

  protected void setUp() throws Exception {
    super.setUp();

    dateParser = new SimpleDateFormat("MMM dd, yyyy", Locale.ENGLISH);
    dateTimeParser = new SimpleDateFormat("MMM dd, yyyy H:mm:ss.SSS", Locale.ENGLISH);
  }

  protected void tearDown() throws Exception {
    super.tearDown();
  }

  public void test_f6af4c5c() throws Exception {

    Date date = dateTimeParser.parse("October 29, 2020 6:00:00.000");
    try {
      date = DateUtils.round(date, DateUtils.SEMI_MONTH);
    } catch (IllegalArgumentException ex) {}
    
    assertDate();
  }
  
// ❌ outer method assert calls
  private void assertDate() throws Exception {
    // Implementation here
  }
  
// ❌ outer helper method
  void warn(String msg) {
    System.err.println(msg);
  }
}
`;
  return (
    <Modal
      open={open}
      onClose={() => {
        setOpen(false);
      }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      className="flex items-center justify-center"
    >
      <div className="flex flex-col  gap-2 bg-white p-4 rounded-2xl max-h-screen overflow-auto w-[80%]">
        <h2><b className="text-blue-500">Kill Matrix</b></h2>
        <label htmlFor="">
          This is an experimental feature. It works by parsing every single one of your test code separately, and running it against all mutants, to see what mutants are killed by it.
          The more complex and holistic your code is, the harder it is for the regex and AST parse to extract your test code directly. To ensure the best kill matrix experience, aim to write the 
          test methods as simple as possible, with few outer method calls, and preferably none helper static method or variables. This doesn't mean the student's code is not clean, it just means its much
          easier for the syntax parsing to be done so the student can know which mutants are killed by each one of their tests.
        </label>
        <div className="grid md:grid-cols-2 w-full gap-4">
          <div className="flex flex-col gap-2 w-full">
            <h4>Good Example ✅</h4>
            <CodeEditor code={goodExampleCode} />
          </div>
          <div className="flex flex-col gap-2 w-full">
            <h4>Bad Example ❌</h4>
            <CodeEditor code={badExampleCode} />
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default HelpModalView;