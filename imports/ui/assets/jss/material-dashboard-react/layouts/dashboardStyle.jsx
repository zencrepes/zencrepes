import {
    drawerWidth,
    transition,
    container
} from "../material-dashboard-react.jsx";

const appStyle = theme => ({
    wrapper: {
        position: "relative",
        top: "0",
        height: "100vh"
    },
    mainPanel: {
        [theme.breakpoints.up("md")]: {
            width: `calc(100% - ${drawerWidth}px)`
        },
        overflow: "auto",
        position: "relative",
        float: "right",
        ...transition,
        maxHeight: "100%",
        width: "100%",
        overflowScrolling: "touch"
    },
    content: {
        marginTop: "70px",
        padding: "30px 15px",
        minHeight: "calc(100vh - 123px)"
    },
    appBar: {
        display: 'grid',
        height: '100%',
        gridTemplateColumns: '1fr 1fr 1fr',
        gridTemplateRows: '1fr',
        gridTemplateAreas: ". . .",
    },
    container,
    map: {
        marginTop: "70px"
    },
    mainContent :{
        display: 'grid',
        height: '100%',
        gridTemplateColumns: '250px auto',
        gridTemplateRows: 'auto 1fr',
        gridTemplateAreas: '"Query Query" "Facets Results"',
    },
    Query :{
        gridArea: 'Query',
    },
    Facets :{
        gridArea: 'Facets',
    },
    Results :{
        gridArea: 'Results',
        paddingLeft: '10px',
    },
    fullWidth :{
        width: '100%',
    }

});

export default appStyle;