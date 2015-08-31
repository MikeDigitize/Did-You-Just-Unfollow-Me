import React from "react";
import Format from "js/number-formatter";

export default class ResultsSelect extends React.Component {

    render() {
        return (
            <div>
                <p className="resultsTitle">Number of results to display</p>
                <select className="form-control resultsSize" id={ this.props.id } onChange={ this.props.setPageResults }>
                    <option value="3">3</option>
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="100">100</option>
                </select>
                <em className="resultsDisplayed">Showing results { Format(this.props.min) } to { Format(this.props.max) } of { Format(this.props.count) }.</em>
            </div>
        );
    }
}