import React, {Component} from 'react'
import './simpleTable.css'
class SimpleTable extends Component {
    render () {
        let {matrix =[[]], head=false} = this.props
        let cellClass = head ? 'simple-head-cell' : 'simple-cell'
        return (<table className="simple-table">
                <tbody>
                    {
                        matrix.map((row, index) => {
                            return (
                                <tr key={index}>
                                { 
                                    row.map((cell, index) => {
                                        return <td width={400} key={index}><div className={cellClass}>{cell}</div></td>
                                    })
                                }
                                </tr>)
                        })
                    }
                </tbody>
                </table>)
    }
}
export default SimpleTable