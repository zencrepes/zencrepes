import { container } from "../thatapp.jsx";

const wizardViewStyle = {
    container: {
        ...container,
        zIndex: "2",
        position: "relative",
        paddingTop: "20vh",
        color: "#FFFFFF",
    },
    instructions: {
        marginTop: '10px',
        marginBottom: '10px',
    },
    wizardCard: {
        padding: '20px',
        height: '500px',
        display: 'grid',
        gridTemplateRows: '1fr auto',
    },
    wizardCardContent: {
        maxHeight: '350px',
        overflow: 'auto',
    },
    wizardCardActions: {
        gridRowStart: '2',
        gridRowEnd: '3',
    },
    pageHeader: {
        minHeight: "100vh",
        maxHeight: "1200px",
        height: "auto",
        display: "inherit",
        position: "relative",
        margin: "0",
        padding: "0",
        border: "0",
        alignItems: "center",
        "&:before": {
            background: "rgba(0, 0, 0, 0.5)"
        },
        "&:before,&:after": {
            position: "absolute",
            zIndex: "1",
            width: "100%",
            height: "100%",
            display: "block",
            left: "0",
            top: "0",
            content: '""'
        },
        "& footer li a,& footer li a:hover,& footer li a:active": {
            color: "#FFFFFF"
        }
    },
};
export default wizardViewStyle;