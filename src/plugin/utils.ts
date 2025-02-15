import { CompilerOptions } from 'typescript';
import * as ts_module from 'typescript/lib/tsserverlibrary';
import { PLUGIN_NAME } from '../common/constants';

export type PluginInfo = ts_module.server.PluginCreateInfo;

export function turnOnStrictMode(
  info: PluginInfo,
  currentOptions: CompilerOptions,
  overrides?: CompilerOptions,
): void {
  info.project.setCompilerOptions({
    ...currentOptions,
    ...overrides,
    strict: true,
  });
}

export function turnOffStrictMode(
  info: PluginInfo,
  currentOptions: CompilerOptions,
  overrides: CompilerOptions,
): void {
  const overridesInverted = { ...overrides };
  if (overridesInverted) {
    // invert all options for turning them off
    Object.keys(overridesInverted).forEach((key) => {
      if (typeof overridesInverted[key] === 'boolean') {
        overridesInverted[key] = !overridesInverted[key];
      }
    });
  }
  info.project.setCompilerOptions({
    ...currentOptions,
    ...overridesInverted,
    strict: false,
  });
}

export function setupProxy(info: PluginInfo) {
  const proxy: ts.LanguageService = Object.create(null);
  for (const k of Object.keys(info.languageService) as Array<keyof ts.LanguageService>) {
    const serviceFunction = info.languageService[k];
    // @ts-ignore
    proxy[k] = (...args: Array<unknown>) => serviceFunction!.apply(info.languageService, args);
  }

  return proxy;
}

export function log(info: PluginInfo, message: string) {
  info.project.projectService.logger.info(`[${PLUGIN_NAME}]: ` + message);
}
