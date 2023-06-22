interface ConfigVars {
  [key: string]: any;
}

const vars: ConfigVars = {
  local: {
    uri: 'http://localhost:5076/',
  },
};

export default vars['local'];
