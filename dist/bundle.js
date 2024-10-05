/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./.core/env.ts":
/*!**********************!*\
  !*** ./.core/env.ts ***!
  \**********************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   requiredVars: () => (/* binding */ requiredVars),
/* harmony export */   setupEnv: () => (/* binding */ setupEnv)
/* harmony export */ });
/* harmony import */ var chalk__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! chalk */ "./node_modules/chalk/source/index.js");
/* harmony import */ var _logger__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./logger */ "./.core/logger.ts");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_logger__WEBPACK_IMPORTED_MODULE_0__]);
_logger__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];


const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';
let fs, dotenv, path;
if (!isBrowser) {
  fs = await __webpack_require__.e(/*! import() */ "_3846").then(__webpack_require__.t.bind(__webpack_require__, /*! fs/promises */ "?3846", 23));
  dotenv = await Promise.all(/*! import() */[__webpack_require__.e("vendors-node_modules_dotenv_lib_main_js"), __webpack_require__.e("_d107-_a0c3-_613f-_fd46")]).then(__webpack_require__.t.bind(__webpack_require__, /*! dotenv */ "./node_modules/dotenv/lib/main.js", 23));
  path = await __webpack_require__.e(/*! import() */ "_f522").then(__webpack_require__.t.bind(__webpack_require__, /*! path */ "?f522", 23));
}
const requiredVars = ['APP_NAME', 'ENV'];
async function prompt(question) {
  if (isBrowser) {
    return new Promise(resolve => {
      const answer = window.prompt(question);
      resolve(answer || '');
    });
  } else {
    const readline = await __webpack_require__.e(/*! import() */ "_688f").then(__webpack_require__.t.bind(__webpack_require__, /*! readline */ "?688f", 23));
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    return new Promise(resolve => {
      rl.question(question, answer => {
        rl.close();
        resolve(answer);
      });
    });
  }
}
async function readJsonFile(filePath) {
  if (isBrowser) {
    return null;
  }
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    return null;
  }
}
async function writeJsonFile(filePath, content) {
  if (isBrowser) {
    return;
  }
  await fs.writeFile(filePath, JSON.stringify(content, null, 2));
}
async function updateEnvFile(env, filename, varsToWrite) {
  if (isBrowser) {
    return;
  }
  let content = '';
  for (const key of varsToWrite) {
    if (env[key] !== undefined) {
      content += `${key}=${env[key]}\n`;
    }
  }
  await fs.writeFile(filename, content);
}
async function setupConfig() {
  let config;
  if (isBrowser) {
    config = {
      APP_NAME: '',
      ENV: '',
      environmentVariables: [],
      envCheck: true
    };
  } else {
    const configPath = path.join(process.cwd(), 'config.json');
    config = (await readJsonFile(configPath)) || {
      APP_NAME: '',
      ENV: '',
      environmentVariables: [],
      envCheck: true
    };
  }
  if (!config.APP_NAME) {
    config.APP_NAME = await prompt('Please enter the APP_NAME: ');
  }
  if (!config.ENV) {
    let isValidEnv = false;
    while (!isValidEnv) {
      const envInput = await prompt('Please enter the environment ("d" or "development" for development, "p" or "production" for production): ');
      const lowercaseInput = envInput.toLowerCase();
      if (lowercaseInput === 'd' || lowercaseInput === 'development') {
        config.ENV = 'development';
        isValidEnv = true;
      } else if (lowercaseInput === 'p' || lowercaseInput === 'production') {
        config.ENV = 'production';
        isValidEnv = true;
      } else {
        _logger__WEBPACK_IMPORTED_MODULE_0__.Logger.log(chalk__WEBPACK_IMPORTED_MODULE_1__["default"].red(`Invalid input "${envInput}".`));
      }
    }
  }
  if (!isBrowser) {
    const configPath = path.join(process.cwd(), 'config.json');
    await writeJsonFile(configPath, config);
    _logger__WEBPACK_IMPORTED_MODULE_0__.Logger.log(chalk__WEBPACK_IMPORTED_MODULE_1__["default"].green('Updated config.json with new values'));
  }
  return config;
}
async function manageEnvironmentVariables(config, env) {
  _logger__WEBPACK_IMPORTED_MODULE_0__.Logger.log(chalk__WEBPACK_IMPORTED_MODULE_1__["default"].cyan('Environment Check Enabled'));
  let managing = true;
  while (managing) {
    _logger__WEBPACK_IMPORTED_MODULE_0__.Logger.log(chalk__WEBPACK_IMPORTED_MODULE_1__["default"].cyan('\nCurrent environment variables:'));
    if (config.environmentVariables.length === 0) {
      _logger__WEBPACK_IMPORTED_MODULE_0__.Logger.log(chalk__WEBPACK_IMPORTED_MODULE_1__["default"].yellow('No environment variables found.'));
    }
    config.environmentVariables.forEach((varName, index) => {
      _logger__WEBPACK_IMPORTED_MODULE_0__.Logger.log(chalk__WEBPACK_IMPORTED_MODULE_1__["default"].cyan(`${index + 1}. ${varName}: ${env[varName] || 'Not set'}`));
    });
    const action = await prompt(`\nDo you want to\n
(a)dd an environment variable, 
(c)lear all environment variables,
(r)emove an environment variable, 
(d)isable environment checks (to enable "envCheck": true),
(f)inish managing environment variables?\n\nInput action: `);
    switch (action.toLowerCase()) {
      case 'a':
        const newVarName = await prompt('Enter new variable name: ');
        if (newVarName && !config.environmentVariables.includes(newVarName)) {
          config.environmentVariables.push(newVarName);
          const newVarValue = await prompt(`Enter value for ${newVarName}: `);
          env[newVarName] = newVarValue;
          _logger__WEBPACK_IMPORTED_MODULE_0__.Logger.log(chalk__WEBPACK_IMPORTED_MODULE_1__["default"].green(`Added ${newVarName}`));
        }
        break;
      case 'c':
        config.environmentVariables = [];
        env = {
          APP_NAME: config.APP_NAME,
          ENV: config.ENV
        };
        _logger__WEBPACK_IMPORTED_MODULE_0__.Logger.log(chalk__WEBPACK_IMPORTED_MODULE_1__["default"].yellow('All environment variables cleared.'));
        break;
      case 'r':
        const removeIndex = parseInt(await prompt('Enter the number of the variable to remove: ')) - 1;
        if (removeIndex >= 0 && removeIndex < config.environmentVariables.length) {
          const removedVar = config.environmentVariables.splice(removeIndex, 1)[0];
          delete env[removedVar];
          _logger__WEBPACK_IMPORTED_MODULE_0__.Logger.log(chalk__WEBPACK_IMPORTED_MODULE_1__["default"].yellow(`Removed ${removedVar}`));
        }
        break;
      case 'd':
        config.envCheck = false;
        _logger__WEBPACK_IMPORTED_MODULE_0__.Logger.log(chalk__WEBPACK_IMPORTED_MODULE_1__["default"].cyan(`Environment check ${config.envCheck ? 'enabled' : 'disabled'}`));
        break;
      case 'f':
        managing = false;
        break;
      default:
        _logger__WEBPACK_IMPORTED_MODULE_0__.Logger.log(chalk__WEBPACK_IMPORTED_MODULE_1__["default"].red('Invalid option. Please try again.'));
    }
    await saveEnvironmentChanges(config, env);
  }
  return env;
}
async function saveEnvironmentChanges(config, env) {
  if (isBrowser) {
    return;
  }
  const configPath = path.join(process.cwd(), 'config.json');
  await writeJsonFile(configPath, config);
  if (config.ENV === 'development') {
    const envFile = '.env';
    await updateEnvFile(env, envFile, config.environmentVariables);
    _logger__WEBPACK_IMPORTED_MODULE_0__.Logger.log(chalk__WEBPACK_IMPORTED_MODULE_1__["default"].green(`Updated ${envFile} file with new values`));
  } else {
    _logger__WEBPACK_IMPORTED_MODULE_0__.Logger.log(chalk__WEBPACK_IMPORTED_MODULE_1__["default"].yellow('Production environment uses system variables. Current values:'));
    config.environmentVariables.forEach(varName => {
      if (env[varName] !== undefined) {
        _logger__WEBPACK_IMPORTED_MODULE_0__.Logger.log(chalk__WEBPACK_IMPORTED_MODULE_1__["default"].yellow(`${varName}=${env[varName]}`));
      } else {
        _logger__WEBPACK_IMPORTED_MODULE_0__.Logger.log(chalk__WEBPACK_IMPORTED_MODULE_1__["default"].red(`${varName} is not set`));
      }
    });
  }
}
async function setupEnv() {
  _logger__WEBPACK_IMPORTED_MODULE_0__.Logger.clear();
  const config = await setupConfig();
  let env = {
    APP_NAME: config.APP_NAME,
    ENV: config.ENV
  };
  if (!isBrowser) {
    const envFile = config.ENV === 'development' ? '.env' : '.env.production';
    if (config.ENV === 'development') {
      dotenv.config({
        path: envFile
      });
    }
    for (const varName of config.environmentVariables) {
      if (process.env[varName] !== undefined) {
        env[varName] = process.env[varName];
      }
    }
  }
  if (config.envCheck) {
    env = await manageEnvironmentVariables(config, env);
  }
  for (const varName of config.environmentVariables) {
    if (env[varName] === undefined) {
      const value = await prompt(`Please enter the value for ${varName}: `);
      if (value) {
        env[varName] = value;
      }
    }
  }
  if (!isBrowser) {
    await saveEnvironmentChanges(config, env);
  }
  for (const requiredVar of requiredVars) {
    if (env[requiredVar] === undefined) {
      throw new Error(`Required environment variable ${requiredVar} is missing`);
    }
  }
  return env;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } }, 1);

/***/ }),

/***/ "./.core/logger.ts":
/*!*************************!*\
  !*** ./.core/logger.ts ***!
  \*************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LogLevel: () => (/* binding */ LogLevel),
/* harmony export */   Logger: () => (/* binding */ Logger)
/* harmony export */ });
/* harmony import */ var chalk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! chalk */ "./node_modules/chalk/source/index.js");
const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';
let dotenv;
if (!isBrowser) {
  dotenv = await Promise.all(/*! import() */[__webpack_require__.e("vendors-node_modules_dotenv_lib_main_js"), __webpack_require__.e("_d107-_a0c3-_613f-_fd46")]).then(__webpack_require__.t.bind(__webpack_require__, /*! dotenv */ "./node_modules/dotenv/lib/main.js", 23));
}

let LogLevel = /*#__PURE__*/function (LogLevel) {
  LogLevel[LogLevel["INFO"] = 0] = "INFO";
  LogLevel[LogLevel["SUCCESS"] = 1] = "SUCCESS";
  LogLevel[LogLevel["WARN"] = 2] = "WARN";
  LogLevel[LogLevel["ERROR"] = 3] = "ERROR";
  LogLevel[LogLevel["NONE"] = 4] = "NONE";
  return LogLevel;
}({});
class Logger {
  static environment = (() => !isBrowser ? process.env.ENV : 'production')();
  static timestamp() {
    const now = new Date();
    const hours = `0${now.getHours()}`.slice(-2);
    const minutes = `0${now.getMinutes()}`.slice(-2);
    const seconds = `0${now.getSeconds()}`.slice(-2);
    return `${hours}:${minutes}:${seconds}`;
  }
  static setEnvironment(env) {
    this.environment = env || 'production';
  }
  static shouldLog(forceLog) {
    return forceLog || this.environment === 'development';
  }
  static success(message) {
    let forceLog = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    if (this.shouldLog(forceLog)) {
      this.log(`${chalk__WEBPACK_IMPORTED_MODULE_0__["default"].green('✔')} ${chalk__WEBPACK_IMPORTED_MODULE_0__["default"].green(message)}`);
    }
  }
  static info(message) {
    let forceLog = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    if (this.shouldLog(forceLog)) {
      this.log(`${chalk__WEBPACK_IMPORTED_MODULE_0__["default"].blue(message)}`);
    }
  }
  static warn(message) {
    let forceLog = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    if (this.shouldLog(forceLog)) {
      this.log(`${chalk__WEBPACK_IMPORTED_MODULE_0__["default"].yellow('⚠')} ${chalk__WEBPACK_IMPORTED_MODULE_0__["default"].yellow(message)}`);
    }
  }
  static error(message) {
    let forceLog = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    if (this.shouldLog(forceLog)) {
      this.log(`${chalk__WEBPACK_IMPORTED_MODULE_0__["default"].red('✖')} ${chalk__WEBPACK_IMPORTED_MODULE_0__["default"].red(message)}`);
    }
  }
  static log(message) {
    let color = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : chalk__WEBPACK_IMPORTED_MODULE_0__["default"].white;
    let isBold = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    const formattedMessage = isBold ? chalk__WEBPACK_IMPORTED_MODULE_0__["default"].bold(color(message)) : color(message);
    console.log(formattedMessage);
  }
  static header(text) {
    let forceLog = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    if (this.shouldLog(forceLog)) {
      console.log(chalk__WEBPACK_IMPORTED_MODULE_0__["default"].bold(chalk__WEBPACK_IMPORTED_MODULE_0__["default"].cyan(`
╔════════════════════════════════════════════════╗
║ ${text.padEnd(46)} ║
╚════════════════════════════════════════════════╝`)));
    }
  }
  static logSection(title, color) {
    let forceLog = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    if (this.shouldLog(forceLog)) {
      console.log(color(`\n■ ${title}`));
      console.log(color(`${'─'.repeat(50)}`));
    }
  }
  static logKeyValue(key, value) {
    let forceLog = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    if (this.shouldLog(forceLog)) {
      console.log(`${chalk__WEBPACK_IMPORTED_MODULE_0__["default"].bold(key.padEnd(15))} : ${value}`);
    }
  }
  static clear() {
    console.clear();
  }
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } }, 1);

/***/ }),

/***/ "./index.ts":
/*!******************!*\
  !*** ./index.ts ***!
  \******************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_logger__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./.core/logger */ "./.core/logger.ts");
/* harmony import */ var _src_main__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./src/main */ "./src/main.ts");
/* harmony import */ var chalk__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! chalk */ "./node_modules/chalk/source/index.js");
/* harmony import */ var _core_env__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./.core/env */ "./.core/env.ts");
/* harmony import */ var _config_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./config.json */ "./config.json");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_logger__WEBPACK_IMPORTED_MODULE_0__, _core_env__WEBPACK_IMPORTED_MODULE_2__]);
([_core_logger__WEBPACK_IMPORTED_MODULE_0__, _core_env__WEBPACK_IMPORTED_MODULE_2__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';





(async () => {
  try {
    _core_logger__WEBPACK_IMPORTED_MODULE_0__.Logger.clear();
    let env = {};
    if (!isBrowser) {
      env = await (0,_core_env__WEBPACK_IMPORTED_MODULE_2__.setupEnv)().catch(error => {
        _core_logger__WEBPACK_IMPORTED_MODULE_0__.Logger.error("Error:", error.message);
        process.exit(1);
      });
    } else {
      for (const key of Object.keys(_config_json__WEBPACK_IMPORTED_MODULE_3__)) {
        if (!Array.isArray(_config_json__WEBPACK_IMPORTED_MODULE_3__[key])) {
          env[key] = _config_json__WEBPACK_IMPORTED_MODULE_3__[key];
        }
      }
    }
    _core_logger__WEBPACK_IMPORTED_MODULE_0__.Logger.header(`${env.APP_NAME.toUpperCase()} - ${env.ENV.toUpperCase()} MODE`, true);
    _core_logger__WEBPACK_IMPORTED_MODULE_0__.Logger.logSection("Environment Variables", chalk__WEBPACK_IMPORTED_MODULE_4__["default"].yellowBright, true);
    for (const [key, value] of Object.entries(env)) {
      if (_core_env__WEBPACK_IMPORTED_MODULE_2__.requiredVars.includes(key) || key !== 'ENV') {
        _core_logger__WEBPACK_IMPORTED_MODULE_0__.Logger.logKeyValue(key, value, true);
      }
    }
    _core_logger__WEBPACK_IMPORTED_MODULE_0__.Logger.logSection("Main Program", chalk__WEBPACK_IMPORTED_MODULE_4__["default"].magenta, true);
    const startTime = performance.now();
    await (0,_src_main__WEBPACK_IMPORTED_MODULE_1__.main)();
    const endTime = performance.now();
    _core_logger__WEBPACK_IMPORTED_MODULE_0__.Logger.logSection("Program Completed", chalk__WEBPACK_IMPORTED_MODULE_4__["default"].cyan, true);
    _core_logger__WEBPACK_IMPORTED_MODULE_0__.Logger.logKeyValue("Main program execution time", `${chalk__WEBPACK_IMPORTED_MODULE_4__["default"].green(`${(endTime - startTime).toFixed(2)} ms\n`)}`, true);
  } catch (error) {
    _core_logger__WEBPACK_IMPORTED_MODULE_0__.Logger.logSection("Error Occurred", chalk__WEBPACK_IMPORTED_MODULE_4__["default"].red, true);
    console.error(chalk__WEBPACK_IMPORTED_MODULE_4__["default"].red(`${error.message}`));
    throw error;
  }
})();
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   main: () => (/* binding */ main)
/* harmony export */ });
async function main() {
  console.log("Hello from main function!");
  Promise.resolve().then(() => {
    console.log('Main program done.');
  });
}

/***/ }),

/***/ "./node_modules/chalk/source/index.js":
/*!********************************************!*\
  !*** ./node_modules/chalk/source/index.js ***!
  \********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Chalk: () => (/* binding */ Chalk),
/* harmony export */   backgroundColorNames: () => (/* reexport safe */ _ansi_styles__WEBPACK_IMPORTED_MODULE_1__.backgroundColorNames),
/* harmony export */   backgroundColors: () => (/* reexport safe */ _ansi_styles__WEBPACK_IMPORTED_MODULE_1__.backgroundColorNames),
/* harmony export */   chalkStderr: () => (/* binding */ chalkStderr),
/* harmony export */   colorNames: () => (/* reexport safe */ _ansi_styles__WEBPACK_IMPORTED_MODULE_1__.colorNames),
/* harmony export */   colors: () => (/* reexport safe */ _ansi_styles__WEBPACK_IMPORTED_MODULE_1__.colorNames),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   foregroundColorNames: () => (/* reexport safe */ _ansi_styles__WEBPACK_IMPORTED_MODULE_1__.foregroundColorNames),
/* harmony export */   foregroundColors: () => (/* reexport safe */ _ansi_styles__WEBPACK_IMPORTED_MODULE_1__.foregroundColorNames),
/* harmony export */   modifierNames: () => (/* reexport safe */ _ansi_styles__WEBPACK_IMPORTED_MODULE_1__.modifierNames),
/* harmony export */   modifiers: () => (/* reexport safe */ _ansi_styles__WEBPACK_IMPORTED_MODULE_1__.modifierNames),
/* harmony export */   supportsColor: () => (/* binding */ stdoutColor),
/* harmony export */   supportsColorStderr: () => (/* binding */ stderrColor)
/* harmony export */ });
/* harmony import */ var _ansi_styles__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./vendor/ansi-styles/index.js */ "./node_modules/chalk/source/vendor/ansi-styles/index.js");
/* harmony import */ var _supports_color__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! #supports-color */ "./node_modules/chalk/source/vendor/supports-color/browser.js");
/* harmony import */ var _utilities_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utilities.js */ "./node_modules/chalk/source/utilities.js");




const {stdout: stdoutColor, stderr: stderrColor} = _supports_color__WEBPACK_IMPORTED_MODULE_0__["default"];

const GENERATOR = Symbol('GENERATOR');
const STYLER = Symbol('STYLER');
const IS_EMPTY = Symbol('IS_EMPTY');

// `supportsColor.level` → `ansiStyles.color[name]` mapping
const levelMapping = [
	'ansi',
	'ansi',
	'ansi256',
	'ansi16m',
];

const styles = Object.create(null);

const applyOptions = (object, options = {}) => {
	if (options.level && !(Number.isInteger(options.level) && options.level >= 0 && options.level <= 3)) {
		throw new Error('The `level` option should be an integer from 0 to 3');
	}

	// Detect level if not set manually
	const colorLevel = stdoutColor ? stdoutColor.level : 0;
	object.level = options.level === undefined ? colorLevel : options.level;
};

class Chalk {
	constructor(options) {
		// eslint-disable-next-line no-constructor-return
		return chalkFactory(options);
	}
}

const chalkFactory = options => {
	const chalk = (...strings) => strings.join(' ');
	applyOptions(chalk, options);

	Object.setPrototypeOf(chalk, createChalk.prototype);

	return chalk;
};

function createChalk(options) {
	return chalkFactory(options);
}

Object.setPrototypeOf(createChalk.prototype, Function.prototype);

for (const [styleName, style] of Object.entries(_ansi_styles__WEBPACK_IMPORTED_MODULE_1__["default"])) {
	styles[styleName] = {
		get() {
			const builder = createBuilder(this, createStyler(style.open, style.close, this[STYLER]), this[IS_EMPTY]);
			Object.defineProperty(this, styleName, {value: builder});
			return builder;
		},
	};
}

styles.visible = {
	get() {
		const builder = createBuilder(this, this[STYLER], true);
		Object.defineProperty(this, 'visible', {value: builder});
		return builder;
	},
};

const getModelAnsi = (model, level, type, ...arguments_) => {
	if (model === 'rgb') {
		if (level === 'ansi16m') {
			return _ansi_styles__WEBPACK_IMPORTED_MODULE_1__["default"][type].ansi16m(...arguments_);
		}

		if (level === 'ansi256') {
			return _ansi_styles__WEBPACK_IMPORTED_MODULE_1__["default"][type].ansi256(_ansi_styles__WEBPACK_IMPORTED_MODULE_1__["default"].rgbToAnsi256(...arguments_));
		}

		return _ansi_styles__WEBPACK_IMPORTED_MODULE_1__["default"][type].ansi(_ansi_styles__WEBPACK_IMPORTED_MODULE_1__["default"].rgbToAnsi(...arguments_));
	}

	if (model === 'hex') {
		return getModelAnsi('rgb', level, type, ..._ansi_styles__WEBPACK_IMPORTED_MODULE_1__["default"].hexToRgb(...arguments_));
	}

	return _ansi_styles__WEBPACK_IMPORTED_MODULE_1__["default"][type][model](...arguments_);
};

const usedModels = ['rgb', 'hex', 'ansi256'];

for (const model of usedModels) {
	styles[model] = {
		get() {
			const {level} = this;
			return function (...arguments_) {
				const styler = createStyler(getModelAnsi(model, levelMapping[level], 'color', ...arguments_), _ansi_styles__WEBPACK_IMPORTED_MODULE_1__["default"].color.close, this[STYLER]);
				return createBuilder(this, styler, this[IS_EMPTY]);
			};
		},
	};

	const bgModel = 'bg' + model[0].toUpperCase() + model.slice(1);
	styles[bgModel] = {
		get() {
			const {level} = this;
			return function (...arguments_) {
				const styler = createStyler(getModelAnsi(model, levelMapping[level], 'bgColor', ...arguments_), _ansi_styles__WEBPACK_IMPORTED_MODULE_1__["default"].bgColor.close, this[STYLER]);
				return createBuilder(this, styler, this[IS_EMPTY]);
			};
		},
	};
}

const proto = Object.defineProperties(() => {}, {
	...styles,
	level: {
		enumerable: true,
		get() {
			return this[GENERATOR].level;
		},
		set(level) {
			this[GENERATOR].level = level;
		},
	},
});

const createStyler = (open, close, parent) => {
	let openAll;
	let closeAll;
	if (parent === undefined) {
		openAll = open;
		closeAll = close;
	} else {
		openAll = parent.openAll + open;
		closeAll = close + parent.closeAll;
	}

	return {
		open,
		close,
		openAll,
		closeAll,
		parent,
	};
};

const createBuilder = (self, _styler, _isEmpty) => {
	// Single argument is hot path, implicit coercion is faster than anything
	// eslint-disable-next-line no-implicit-coercion
	const builder = (...arguments_) => applyStyle(builder, (arguments_.length === 1) ? ('' + arguments_[0]) : arguments_.join(' '));

	// We alter the prototype because we must return a function, but there is
	// no way to create a function with a different prototype
	Object.setPrototypeOf(builder, proto);

	builder[GENERATOR] = self;
	builder[STYLER] = _styler;
	builder[IS_EMPTY] = _isEmpty;

	return builder;
};

const applyStyle = (self, string) => {
	if (self.level <= 0 || !string) {
		return self[IS_EMPTY] ? '' : string;
	}

	let styler = self[STYLER];

	if (styler === undefined) {
		return string;
	}

	const {openAll, closeAll} = styler;
	if (string.includes('\u001B')) {
		while (styler !== undefined) {
			// Replace any instances already present with a re-opening code
			// otherwise only the part of the string until said closing code
			// will be colored, and the rest will simply be 'plain'.
			string = (0,_utilities_js__WEBPACK_IMPORTED_MODULE_2__.stringReplaceAll)(string, styler.close, styler.open);

			styler = styler.parent;
		}
	}

	// We can move both next actions out of loop, because remaining actions in loop won't have
	// any/visible effect on parts we add here. Close the styling before a linebreak and reopen
	// after next line to fix a bleed issue on macOS: https://github.com/chalk/chalk/pull/92
	const lfIndex = string.indexOf('\n');
	if (lfIndex !== -1) {
		string = (0,_utilities_js__WEBPACK_IMPORTED_MODULE_2__.stringEncaseCRLFWithFirstIndex)(string, closeAll, openAll, lfIndex);
	}

	return openAll + string + closeAll;
};

Object.defineProperties(createChalk.prototype, styles);

const chalk = createChalk();
const chalkStderr = createChalk({level: stderrColor ? stderrColor.level : 0});





/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (chalk);


/***/ }),

/***/ "./node_modules/chalk/source/utilities.js":
/*!************************************************!*\
  !*** ./node_modules/chalk/source/utilities.js ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   stringEncaseCRLFWithFirstIndex: () => (/* binding */ stringEncaseCRLFWithFirstIndex),
/* harmony export */   stringReplaceAll: () => (/* binding */ stringReplaceAll)
/* harmony export */ });
// TODO: When targeting Node.js 16, use `String.prototype.replaceAll`.
function stringReplaceAll(string, substring, replacer) {
	let index = string.indexOf(substring);
	if (index === -1) {
		return string;
	}

	const substringLength = substring.length;
	let endIndex = 0;
	let returnValue = '';
	do {
		returnValue += string.slice(endIndex, index) + substring + replacer;
		endIndex = index + substringLength;
		index = string.indexOf(substring, endIndex);
	} while (index !== -1);

	returnValue += string.slice(endIndex);
	return returnValue;
}

function stringEncaseCRLFWithFirstIndex(string, prefix, postfix, index) {
	let endIndex = 0;
	let returnValue = '';
	do {
		const gotCR = string[index - 1] === '\r';
		returnValue += string.slice(endIndex, (gotCR ? index - 1 : index)) + prefix + (gotCR ? '\r\n' : '\n') + postfix;
		endIndex = index + 1;
		index = string.indexOf('\n', endIndex);
	} while (index !== -1);

	returnValue += string.slice(endIndex);
	return returnValue;
}


/***/ }),

/***/ "./node_modules/chalk/source/vendor/ansi-styles/index.js":
/*!***************************************************************!*\
  !*** ./node_modules/chalk/source/vendor/ansi-styles/index.js ***!
  \***************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   backgroundColorNames: () => (/* binding */ backgroundColorNames),
/* harmony export */   colorNames: () => (/* binding */ colorNames),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   foregroundColorNames: () => (/* binding */ foregroundColorNames),
/* harmony export */   modifierNames: () => (/* binding */ modifierNames)
/* harmony export */ });
const ANSI_BACKGROUND_OFFSET = 10;

const wrapAnsi16 = (offset = 0) => code => `\u001B[${code + offset}m`;

const wrapAnsi256 = (offset = 0) => code => `\u001B[${38 + offset};5;${code}m`;

const wrapAnsi16m = (offset = 0) => (red, green, blue) => `\u001B[${38 + offset};2;${red};${green};${blue}m`;

const styles = {
	modifier: {
		reset: [0, 0],
		// 21 isn't widely supported and 22 does the same thing
		bold: [1, 22],
		dim: [2, 22],
		italic: [3, 23],
		underline: [4, 24],
		overline: [53, 55],
		inverse: [7, 27],
		hidden: [8, 28],
		strikethrough: [9, 29],
	},
	color: {
		black: [30, 39],
		red: [31, 39],
		green: [32, 39],
		yellow: [33, 39],
		blue: [34, 39],
		magenta: [35, 39],
		cyan: [36, 39],
		white: [37, 39],

		// Bright color
		blackBright: [90, 39],
		gray: [90, 39], // Alias of `blackBright`
		grey: [90, 39], // Alias of `blackBright`
		redBright: [91, 39],
		greenBright: [92, 39],
		yellowBright: [93, 39],
		blueBright: [94, 39],
		magentaBright: [95, 39],
		cyanBright: [96, 39],
		whiteBright: [97, 39],
	},
	bgColor: {
		bgBlack: [40, 49],
		bgRed: [41, 49],
		bgGreen: [42, 49],
		bgYellow: [43, 49],
		bgBlue: [44, 49],
		bgMagenta: [45, 49],
		bgCyan: [46, 49],
		bgWhite: [47, 49],

		// Bright color
		bgBlackBright: [100, 49],
		bgGray: [100, 49], // Alias of `bgBlackBright`
		bgGrey: [100, 49], // Alias of `bgBlackBright`
		bgRedBright: [101, 49],
		bgGreenBright: [102, 49],
		bgYellowBright: [103, 49],
		bgBlueBright: [104, 49],
		bgMagentaBright: [105, 49],
		bgCyanBright: [106, 49],
		bgWhiteBright: [107, 49],
	},
};

const modifierNames = Object.keys(styles.modifier);
const foregroundColorNames = Object.keys(styles.color);
const backgroundColorNames = Object.keys(styles.bgColor);
const colorNames = [...foregroundColorNames, ...backgroundColorNames];

function assembleStyles() {
	const codes = new Map();

	for (const [groupName, group] of Object.entries(styles)) {
		for (const [styleName, style] of Object.entries(group)) {
			styles[styleName] = {
				open: `\u001B[${style[0]}m`,
				close: `\u001B[${style[1]}m`,
			};

			group[styleName] = styles[styleName];

			codes.set(style[0], style[1]);
		}

		Object.defineProperty(styles, groupName, {
			value: group,
			enumerable: false,
		});
	}

	Object.defineProperty(styles, 'codes', {
		value: codes,
		enumerable: false,
	});

	styles.color.close = '\u001B[39m';
	styles.bgColor.close = '\u001B[49m';

	styles.color.ansi = wrapAnsi16();
	styles.color.ansi256 = wrapAnsi256();
	styles.color.ansi16m = wrapAnsi16m();
	styles.bgColor.ansi = wrapAnsi16(ANSI_BACKGROUND_OFFSET);
	styles.bgColor.ansi256 = wrapAnsi256(ANSI_BACKGROUND_OFFSET);
	styles.bgColor.ansi16m = wrapAnsi16m(ANSI_BACKGROUND_OFFSET);

	// From https://github.com/Qix-/color-convert/blob/3f0e0d4e92e235796ccb17f6e85c72094a651f49/conversions.js
	Object.defineProperties(styles, {
		rgbToAnsi256: {
			value(red, green, blue) {
				// We use the extended greyscale palette here, with the exception of
				// black and white. normal palette only has 4 greyscale shades.
				if (red === green && green === blue) {
					if (red < 8) {
						return 16;
					}

					if (red > 248) {
						return 231;
					}

					return Math.round(((red - 8) / 247) * 24) + 232;
				}

				return 16
					+ (36 * Math.round(red / 255 * 5))
					+ (6 * Math.round(green / 255 * 5))
					+ Math.round(blue / 255 * 5);
			},
			enumerable: false,
		},
		hexToRgb: {
			value(hex) {
				const matches = /[a-f\d]{6}|[a-f\d]{3}/i.exec(hex.toString(16));
				if (!matches) {
					return [0, 0, 0];
				}

				let [colorString] = matches;

				if (colorString.length === 3) {
					colorString = [...colorString].map(character => character + character).join('');
				}

				const integer = Number.parseInt(colorString, 16);

				return [
					/* eslint-disable no-bitwise */
					(integer >> 16) & 0xFF,
					(integer >> 8) & 0xFF,
					integer & 0xFF,
					/* eslint-enable no-bitwise */
				];
			},
			enumerable: false,
		},
		hexToAnsi256: {
			value: hex => styles.rgbToAnsi256(...styles.hexToRgb(hex)),
			enumerable: false,
		},
		ansi256ToAnsi: {
			value(code) {
				if (code < 8) {
					return 30 + code;
				}

				if (code < 16) {
					return 90 + (code - 8);
				}

				let red;
				let green;
				let blue;

				if (code >= 232) {
					red = (((code - 232) * 10) + 8) / 255;
					green = red;
					blue = red;
				} else {
					code -= 16;

					const remainder = code % 36;

					red = Math.floor(code / 36) / 5;
					green = Math.floor(remainder / 6) / 5;
					blue = (remainder % 6) / 5;
				}

				const value = Math.max(red, green, blue) * 2;

				if (value === 0) {
					return 30;
				}

				// eslint-disable-next-line no-bitwise
				let result = 30 + ((Math.round(blue) << 2) | (Math.round(green) << 1) | Math.round(red));

				if (value === 2) {
					result += 60;
				}

				return result;
			},
			enumerable: false,
		},
		rgbToAnsi: {
			value: (red, green, blue) => styles.ansi256ToAnsi(styles.rgbToAnsi256(red, green, blue)),
			enumerable: false,
		},
		hexToAnsi: {
			value: hex => styles.ansi256ToAnsi(styles.hexToAnsi256(hex)),
			enumerable: false,
		},
	});

	return styles;
}

const ansiStyles = assembleStyles();

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ansiStyles);


/***/ }),

/***/ "./node_modules/chalk/source/vendor/supports-color/browser.js":
/*!********************************************************************!*\
  !*** ./node_modules/chalk/source/vendor/supports-color/browser.js ***!
  \********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* eslint-env browser */

const level = (() => {
	if (navigator.userAgentData) {
		const brand = navigator.userAgentData.brands.find(({brand}) => brand === 'Chromium');
		if (brand && brand.version > 93) {
			return 3;
		}
	}

	if (/\b(Chrome|Chromium)\//.test(navigator.userAgent)) {
		return 1;
	}

	return 0;
})();

const colorSupport = level !== 0 && {
	level,
	hasBasic: true,
	has256: level >= 2,
	has16m: level >= 3,
};

const supportsColor = {
	stdout: colorSupport,
	stderr: colorSupport,
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (supportsColor);


/***/ }),

/***/ "./config.json":
/*!*********************!*\
  !*** ./config.json ***!
  \*********************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"APP_NAME":"webpack-template","ENV":"development","environmentVariables":[],"envCheck":false}');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/async module */
/******/ 	(() => {
/******/ 		var webpackQueues = typeof Symbol === "function" ? Symbol("webpack queues") : "__webpack_queues__";
/******/ 		var webpackExports = typeof Symbol === "function" ? Symbol("webpack exports") : "__webpack_exports__";
/******/ 		var webpackError = typeof Symbol === "function" ? Symbol("webpack error") : "__webpack_error__";
/******/ 		var resolveQueue = (queue) => {
/******/ 			if(queue && queue.d < 1) {
/******/ 				queue.d = 1;
/******/ 				queue.forEach((fn) => (fn.r--));
/******/ 				queue.forEach((fn) => (fn.r-- ? fn.r++ : fn()));
/******/ 			}
/******/ 		}
/******/ 		var wrapDeps = (deps) => (deps.map((dep) => {
/******/ 			if(dep !== null && typeof dep === "object") {
/******/ 				if(dep[webpackQueues]) return dep;
/******/ 				if(dep.then) {
/******/ 					var queue = [];
/******/ 					queue.d = 0;
/******/ 					dep.then((r) => {
/******/ 						obj[webpackExports] = r;
/******/ 						resolveQueue(queue);
/******/ 					}, (e) => {
/******/ 						obj[webpackError] = e;
/******/ 						resolveQueue(queue);
/******/ 					});
/******/ 					var obj = {};
/******/ 					obj[webpackQueues] = (fn) => (fn(queue));
/******/ 					return obj;
/******/ 				}
/******/ 			}
/******/ 			var ret = {};
/******/ 			ret[webpackQueues] = x => {};
/******/ 			ret[webpackExports] = dep;
/******/ 			return ret;
/******/ 		}));
/******/ 		__webpack_require__.a = (module, body, hasAwait) => {
/******/ 			var queue;
/******/ 			hasAwait && ((queue = []).d = -1);
/******/ 			var depQueues = new Set();
/******/ 			var exports = module.exports;
/******/ 			var currentDeps;
/******/ 			var outerResolve;
/******/ 			var reject;
/******/ 			var promise = new Promise((resolve, rej) => {
/******/ 				reject = rej;
/******/ 				outerResolve = resolve;
/******/ 			});
/******/ 			promise[webpackExports] = exports;
/******/ 			promise[webpackQueues] = (fn) => (queue && fn(queue), depQueues.forEach(fn), promise["catch"](x => {}));
/******/ 			module.exports = promise;
/******/ 			body((deps) => {
/******/ 				currentDeps = wrapDeps(deps);
/******/ 				var fn;
/******/ 				var getResult = () => (currentDeps.map((d) => {
/******/ 					if(d[webpackError]) throw d[webpackError];
/******/ 					return d[webpackExports];
/******/ 				}))
/******/ 				var promise = new Promise((resolve) => {
/******/ 					fn = () => (resolve(getResult));
/******/ 					fn.r = 0;
/******/ 					var fnQueue = (q) => (q !== queue && !depQueues.has(q) && (depQueues.add(q), q && !q.d && (fn.r++, q.push(fn))));
/******/ 					currentDeps.map((dep) => (dep[webpackQueues](fnQueue)));
/******/ 				});
/******/ 				return fn.r ? promise : getResult();
/******/ 			}, (err) => ((err ? reject(promise[webpackError] = err) : outerResolve(exports)), resolveQueue(queue)));
/******/ 			queue && queue.d < 0 && (queue.d = 0);
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/create fake namespace object */
/******/ 	(() => {
/******/ 		var getProto = Object.getPrototypeOf ? (obj) => (Object.getPrototypeOf(obj)) : (obj) => (obj.__proto__);
/******/ 		var leafPrototypes;
/******/ 		// create a fake namespace object
/******/ 		// mode & 1: value is a module id, require it
/******/ 		// mode & 2: merge all properties of value into the ns
/******/ 		// mode & 4: return value when already ns object
/******/ 		// mode & 16: return value when it's Promise-like
/******/ 		// mode & 8|1: behave like require
/******/ 		__webpack_require__.t = function(value, mode) {
/******/ 			if(mode & 1) value = this(value);
/******/ 			if(mode & 8) return value;
/******/ 			if(typeof value === 'object' && value) {
/******/ 				if((mode & 4) && value.__esModule) return value;
/******/ 				if((mode & 16) && typeof value.then === 'function') return value;
/******/ 			}
/******/ 			var ns = Object.create(null);
/******/ 			__webpack_require__.r(ns);
/******/ 			var def = {};
/******/ 			leafPrototypes = leafPrototypes || [null, getProto({}), getProto([]), getProto(getProto)];
/******/ 			for(var current = mode & 2 && value; typeof current == 'object' && !~leafPrototypes.indexOf(current); current = getProto(current)) {
/******/ 				Object.getOwnPropertyNames(current).forEach((key) => (def[key] = () => (value[key])));
/******/ 			}
/******/ 			def['default'] = () => (value);
/******/ 			__webpack_require__.d(ns, def);
/******/ 			return ns;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/ensure chunk */
/******/ 	(() => {
/******/ 		__webpack_require__.f = {};
/******/ 		// This file contains only the entry chunk.
/******/ 		// The chunk loading function for additional chunks
/******/ 		__webpack_require__.e = (chunkId) => {
/******/ 			return Promise.all(Object.keys(__webpack_require__.f).reduce((promises, key) => {
/******/ 				__webpack_require__.f[key](chunkId, promises);
/******/ 				return promises;
/******/ 			}, []));
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks
/******/ 		__webpack_require__.u = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + ".bundle.js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/load script */
/******/ 	(() => {
/******/ 		var inProgress = {};
/******/ 		var dataWebpackPrefix = "webpack-typescript-project:";
/******/ 		// loadScript function to load a script via script tag
/******/ 		__webpack_require__.l = (url, done, key, chunkId) => {
/******/ 			if(inProgress[url]) { inProgress[url].push(done); return; }
/******/ 			var script, needAttach;
/******/ 			if(key !== undefined) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				for(var i = 0; i < scripts.length; i++) {
/******/ 					var s = scripts[i];
/******/ 					if(s.getAttribute("src") == url || s.getAttribute("data-webpack") == dataWebpackPrefix + key) { script = s; break; }
/******/ 				}
/******/ 			}
/******/ 			if(!script) {
/******/ 				needAttach = true;
/******/ 				script = document.createElement('script');
/******/ 		
/******/ 				script.charset = 'utf-8';
/******/ 				script.timeout = 120;
/******/ 				if (__webpack_require__.nc) {
/******/ 					script.setAttribute("nonce", __webpack_require__.nc);
/******/ 				}
/******/ 				script.setAttribute("data-webpack", dataWebpackPrefix + key);
/******/ 		
/******/ 				script.src = url;
/******/ 			}
/******/ 			inProgress[url] = [done];
/******/ 			var onScriptComplete = (prev, event) => {
/******/ 				// avoid mem leaks in IE.
/******/ 				script.onerror = script.onload = null;
/******/ 				clearTimeout(timeout);
/******/ 				var doneFns = inProgress[url];
/******/ 				delete inProgress[url];
/******/ 				script.parentNode && script.parentNode.removeChild(script);
/******/ 				doneFns && doneFns.forEach((fn) => (fn(event)));
/******/ 				if(prev) return prev(event);
/******/ 			}
/******/ 			var timeout = setTimeout(onScriptComplete.bind(null, undefined, { type: 'timeout', target: script }), 120000);
/******/ 			script.onerror = onScriptComplete.bind(null, script.onerror);
/******/ 			script.onload = onScriptComplete.bind(null, script.onload);
/******/ 			needAttach && document.head.appendChild(script);
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		__webpack_require__.p = "/";
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.f.j = (chunkId, promises) => {
/******/ 				// JSONP chunk loading for javascript
/******/ 				var installedChunkData = __webpack_require__.o(installedChunks, chunkId) ? installedChunks[chunkId] : undefined;
/******/ 				if(installedChunkData !== 0) { // 0 means "already installed".
/******/ 		
/******/ 					// a Promise means "currently loading".
/******/ 					if(installedChunkData) {
/******/ 						promises.push(installedChunkData[2]);
/******/ 					} else {
/******/ 						if(true) { // all chunks have JS
/******/ 							// setup Promise in chunk cache
/******/ 							var promise = new Promise((resolve, reject) => (installedChunkData = installedChunks[chunkId] = [resolve, reject]));
/******/ 							promises.push(installedChunkData[2] = promise);
/******/ 		
/******/ 							// start chunk loading
/******/ 							var url = __webpack_require__.p + __webpack_require__.u(chunkId);
/******/ 							// create error before stack unwound to get useful stacktrace later
/******/ 							var error = new Error();
/******/ 							var loadingEnded = (event) => {
/******/ 								if(__webpack_require__.o(installedChunks, chunkId)) {
/******/ 									installedChunkData = installedChunks[chunkId];
/******/ 									if(installedChunkData !== 0) installedChunks[chunkId] = undefined;
/******/ 									if(installedChunkData) {
/******/ 										var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 										var realSrc = event && event.target && event.target.src;
/******/ 										error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
/******/ 										error.name = 'ChunkLoadError';
/******/ 										error.type = errorType;
/******/ 										error.request = realSrc;
/******/ 										installedChunkData[1](error);
/******/ 									}
/******/ 								}
/******/ 							};
/******/ 							__webpack_require__.l(url, loadingEnded, "chunk-" + chunkId, chunkId);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 		};
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 		
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkwebpack_typescript_project"] = self["webpackChunkwebpack_typescript_project"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module used 'module' so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./index.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=bundle.js.map