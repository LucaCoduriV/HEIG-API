import httpntlm from "httpntlm";

export interface NTMLConfig {
  url: string;
  login: string;
  password: string;
  binary?: boolean;
}

class IntranetService {
  public authenticatedCallNTLM(config: NTMLConfig) {
    const ntlm = httpntlm.ntlm;
    const lm = ntlm.create_LM_hashed_password("");
    const nt = ntlm.create_NT_hashed_password(config.password);
    const options = {
      url: config.url,
      username: config.login,
      lm_password: lm,
      nt_password: nt,
      domain: "",
      workstation: "",
      binary: config.binary,
    };

    return new Promise<any>((resolve, reject) => {
      httpntlm.get(options, function (err: any, res: any) {
        if (err) {
          reject(err);
        } else {
          if (res.statusCode === 200) {
            resolve(res);
          } else {
            reject(err);
          }
        }
      });
    });
  }
}

export default new IntranetService();
