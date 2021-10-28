import { join } from "path";
import { getParameters } from 'codesandbox/lib/api/define';
import { FilesRecord, getCodesandboxConfig } from "./getCodesandboxConfig";
import { svc } from "../../services";

const CodesandboxFiles: Record<string, string> = {
    'index.html': join('..', 'data', 'codesandbox', 'index.html'),
    'index.tsx': join('..', 'data', 'codesandbox', 'index.tsx'),
    'package.json': join('..', 'data', 'codesandbox', 'package.json'),
    'tsconfig.json': join('..', 'data', 'codesandbox', 'tsconfig.json'),
    'apiDefinitions.ts': join('..', 'data', 'apiDefinition.ts'),
    '.env': join('..', 'data', 'codesandbox', '.env'),
};

export type CodesandboxFilesRecord = Record<string, string>

class CodesandboxService {
    files: CodesandboxFilesRecord;

    constructor() {
        this.files = {};
    }

    public getFiles(): Promise<void> {
        return Promise.all(Object.keys(CodesandboxFiles).map(name => {
            return svc.api.getCode({ path: CodesandboxFiles[name] })
        })).then(data => data.map(file => file.raw)).then(
            ([ indexHTML, indexTSX, packageJSON, tsConfigJSON, api, env ]) => {
                Object.assign(this.files, {
                    indexHTML,
                    indexTSX,
                    packageJSON,
                    tsConfigJSON,
                    api,
                    env
                });
            }
        );
    }

    public clearFiles(): void {
        Object.assign(this.files, {});
    }

    public getCodesandboxLink(code: string, stylesheets?: FilesRecord): string | null {
        if (Object.values(this.files).every(value => value)) {
            const url: URL = new URL('https://codesandbox.io/api/v1/sandboxes/define');
            url.searchParams.set(
                'parameters',
                getParameters({
                    files: getCodesandboxConfig(
                        this.processCodeContent(code),
                        this.processStylesheets(stylesheets),
                        this.files
                    ),
                })
            );
            url.searchParams.set('query', 'file=/Example.tsx')
            return url.toString();
        } else return null;
    }

    private processCodeContent(code: string): string {
        if (!code) return;
        const separator = '\n';
        const lines = code.split(separator);
        const iconFiles = lines.filter(line => line.includes(`.svg';`) || line.includes(`.svg";`));
        const stylesheetFiles = lines.filter(line => line.includes(`.scss';`) || line.includes(`.scss";`));
        if (iconFiles.length > 0 || stylesheetFiles.length > 0) {
            return lines.map(line => {
                if (iconFiles.includes(line)) {
                    return line.replace(/import\s\*\sas\s(\w+)/, 'import { ReactComponent as $1 }');
                } else if (stylesheetFiles.includes(line)) {
                    return line.replace(/(.example)?.scss/, '.module.scss');
                } else return line;
            }).join(separator);
        } else return code;
    }

    private processStylesheets(stylesheets: FilesRecord): FilesRecord {
        if (Object.keys(stylesheets).length === 0) return {};
        const processedStylesheets = {};
        for (const [path, stylesheet] of Object.entries(stylesheets)) {
            const [file, extension] = path.split('.');
            Object.assign(processedStylesheets, { [`${file}.module.${extension}`]: stylesheet });
        }
        return processedStylesheets;
    }
}

export const codesandboxService = new CodesandboxService();