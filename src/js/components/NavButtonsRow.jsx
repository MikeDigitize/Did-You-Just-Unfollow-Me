import React from "react";

export default class NavButtonsRow extends React.Component {

    render() {
        return (
            <tr>
                <td className="table-head-cell">
                    <button className="btn btn-primary prev-page" onClick={this.props.prev}>Prev</button>
                    <span>{ this.props.title } </span>
                    <button className="btn btn-primary next-page" onClick={this.props.next}>Next</button>
                </td>
            </tr>
        );
    }
}