import util from 'util'
import child from 'child_process'


export default util.promisify(child.exec);
