import 'brace';
import 'brace/mode/json';
import 'brace/theme/pastel_on_dark';

const Editor = require('react-ace').default;

export const AceEditor = ({ value }) => {
  return (
    <Editor
      mode={'json'}
      theme="pastel_on_dark"
      style={{ width: '100%', height: '700px' }}
      readOnly={true}
      wrapEnabled={true}
      showPrintMargin={false}
      value={value}
      editorProps={{ $blockScrolling: true }}
    />
  );
};
