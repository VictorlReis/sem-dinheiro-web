interface ConfigVars {
  [key: string]: any;
}

const vars: ConfigVars = {
  local: {
    uri: 'http://localhost:8000/',
  },
};

export default vars['local'];
