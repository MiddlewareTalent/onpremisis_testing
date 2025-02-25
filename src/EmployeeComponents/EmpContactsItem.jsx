import {useNavigate} from "react-router-dom";

const EmpContactsItem=(props)=>{
    const {each}=props;
    const {contactId,personName,personEmail,personMobile,relation}=each;
    const navigate=useNavigate();
    const path=`/EmpContactsDetails/${contactId}`;

    const details=()=>{
        navigate(path)
    }


    return (
        <tr key={contactId} type="button" onClick={details} className="hover:bg-blue-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="ml-4">

                                                        <div className="text-xl text-gray-500">{personName}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-xl text-gray-900">{personMobile}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-xl text-gray-500">
                                                {personEmail}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-xl text-gray-500">
                                                {relation}
                                            </td>
                                        </tr>
    )
}

export default EmpContactsItem;
