import React, { useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil'

import createAppHelper from '../helpers/createAppHelper'

//State
import { routeAtom, componentsAtom, projectNameAtom, buildToolAtom, dependenciesToAddAtom, environmentAtom } from '../context/GlobalState'

const Settings = () => {

    //State Management
    const [route, setRoute] = useRecoilState(routeAtom);
    const environment = useRecoilValue(environmentAtom);
    const [projectName, setProjetctName] = useRecoilState(projectNameAtom);
    const [components, setComponents] = useRecoilState(componentsAtom);
    const [buildTool, setBuildTool] = useRecoilState(buildToolAtom);
    const [dependencies, setDependencies] = useRecoilState(dependenciesToAddAtom);
    const [script, setScript] = useState(null);

    const handleCreateApp = () => {
        createAppHelper({ environment, route, components, projectName });
        if (buildTool === "yarn") {
            setScript(`yarn create react-app ${projectName} && yarn add ${dependencies} && node createMyApp.js`);
        } else {
            setScript(`npx create-react-app ${projectName} && npm install ${dependencies} && node createMyApp.js`);
        }
    }

    const handleRouteChange = e => {
        e.preventDefault();
        setRoute({
            enabled: route.enabled,
            navigation: e.target.value
        });
    }

    const handleCheckBox = () => {
        setRoute(prevState => {
            return ({
                enabled: !prevState.enabled,
                navigation: prevState.navigation
            })
        })
    }

    const addEmptyComponent = () => {
        setComponents([...components, {
            id: components.length,
            name: "Name",
            type: "FunctionalArrow",
            page: false,
        }])
    }

    const handleNameChange = (e, id) => {
        setComponents(prevState => {
            let tempArray = [];
            prevState.forEach(comp => {
                if (comp.id === id) {
                    tempArray.push({
                        id: comp.id,
                        type: comp.type,
                        page: comp.page,
                        name: e.target.value
                    });
                } else {

                    tempArray.push(comp)
                }
            })
            return tempArray
        })
    }

    const handleTypeChange = (e, id) => {
        setComponents(prevState => {
            let tempArray = [];
            prevState.forEach(comp => {
                if (comp.id === id) {
                    tempArray.push({
                        id: comp.id,
                        type: e.target.value,
                        page: comp.page,
                        name: comp.name
                    });
                } else {

                    tempArray.push(comp)
                }
            })
            return tempArray
        })
    }

    const handlePageChange = (id) => {
        setComponents(prevState => {
            let tempArray = [];
            prevState.forEach(comp => {
                if (comp.id === id) {
                    tempArray.push({
                        id: comp.id,
                        type: comp.type,
                        page: !comp.page,
                        name: comp.name
                    });
                } else {

                    tempArray.push(comp)
                }
            })
            return tempArray
        })
    }

    return (
        <div className="SettingsPane">

            <div className="env">
                <h4 className="head">Environment</h4>
                <select name="environment">
                    <option value="create-react-app">Create React App</option>
                    <option disabled value="comming-soon">More comming soon</option>
                </select>
            </div>

            <div className="buildtool">
                <h4 className="head">Build Tool</h4>
                <select name="buildtool" value={buildTool} onChange={(e) => setBuildTool(e.target.value)} >
                    <option value="yarn">yarn</option>
                    <option value="npx">npx</option>
                </select>
            </div>

            <div className="projectname">
                <h4 className="head">Project Name</h4>
                <p>All small without spaces</p>
                <input type="text" value={projectName} onChange={(e) => setProjetctName(e.target.value)} />
            </div>

            <div className="dependencies">
                <h4 className="head">Dependencies to be added</h4>
                <p>seperated by spaces</p>
                <input type="text" value={dependencies} onChange={(e) => setDependencies(e.target.value)} />
            </div>

            <div className="route">
                <h4 className="head">Route</h4>
                <input type="checkbox" onChange={() => handleCheckBox()} defaultChecked={route.enabled} />
                <select value={route.navigation} onChange={(e) => handleRouteChange(e)} name="route">
                    {
                        components.map(({ name, id }) => <option key={id} value={name}>{name}</option>)
                    }
                </select>
            </div>

            <div className="components">
                <h4 className="head">Components</h4>
                <button onClick={() => addEmptyComponent()}>Add Comp</button>
                <div className="all-comps">
                    {
                        components.map(({ id, name, type, page }) =>
                            <React.Fragment key={id}>
                                <div className="input-comp">
                                    <input type="text" onChange={(e) => handleNameChange(e, id)} value={name} />
                                    <select onChange={(e) => handleTypeChange(e, id)} value={type} >
                                        <option value="FunctionalArrow">FunctionalArrow</option>
                                        <option value="Functional">Functional</option>
                                        <option value="ClassStateFul">ClassStateFul</option>
                                        <option value="ClassStateLess">ClassStateLess</option>
                                    </select>
                                    <input type="checkbox" onChange={() => handlePageChange(id)} defaultChecked={page} />
                                </div>
                            </React.Fragment>
                        )
                    }
                </div>

            </div>

            <button onClick={() => handleCreateApp()}> Create App</button>

            <div className="script">
                {
                    script &&
                    <code>{script}</code>
                }
            </div>

        </div>
    )
}

export default Settings
