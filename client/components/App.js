import FilesForm from './FilesForm';
import CloudStorage from './CloudStorage';

import '../styles/App.sass';


const App = createReactClass({

    render() {
        return (
            <div>
                <div className="App">
                    <div className="container">
                        <FilesForm/>

                                <CloudStorage/>


                    </div>
                </div>
            </div>
        );
    }
});

export default App;