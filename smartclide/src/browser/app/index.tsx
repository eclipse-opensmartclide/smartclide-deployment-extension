import * as React from "react";

const App: React.FC = (): JSX.Element => {
  const [state, setState] = React.useState<Record<string, any>>();

  React.useEffect(() => {
    setState({
      username: "",
      apiToken: "",
    });
  }, [setState]);

  React.useEffect(() => {
    console.log("State", state);
  }, [state]);

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-xs-12 col-md-6 col-md-offset-3">
            <div className="well">
              <div className="row">
                <div className="form-group col-xs-12">
                  <label htmlFor="username" className="text-black ">
                    Gitlab Username
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="username"
                    placeholder="Gitlab Username"
                    name="username"
                    onChange={(e) => console.log(e)}
                  />
                </div>
                <div className="form-group col-xs-12">
                  <label htmlFor="apitoken" className="text-black ">
                    Your Api Token
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="apitoken"
                    placeholder="Your Api Token"
                    name="apitoken"
                    onChange={(e) => console.log(e.target.value)}
                  />
                </div>
                <div className="form-group col-xs-12 text-rigth">
                  <button
                    className="btn btn-primary"
                    title="Display Message"
                    onClick={() => console.log("handle button")}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
