function Loader(state) {
    if (state.isActive) {
        return (
            <div className="spinner-border text-primary" style={{height: "4em", width: "4em"}} role="status">
                <span className="sr-only">Loading...</span>
            </div>
        )
    } else {
        return null;
    }
}

export default Loader;