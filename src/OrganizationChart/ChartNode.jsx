import { UserCircleIcon } from "@heroicons/react/24/solid";

export default function ChartNode({ employee, changeEmployee, isHighlighted }) {

  const changeEmp = () => {
    console.log(employee.employeeId); // Debugging output
    changeEmployee(employee.employeeId); // Ensure changeEmployee is called properly
  };

  return (
    <div
      className={`flex items-center space-x-2 p-3 rounded-lg cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105  ${
        isHighlighted ? 'bg-blue-500 text-white shadow-lg' : 'bg-white text-blue-800 shadow'
      }`}
      onClick={changeEmp}  /* Correctly triggering the changeEmp function */
    >
      <div>
      <UserCircleIcon className="w-8 h-8" />
      </div>
      <div>
        <p className="text-2xl font-semibold">{employee.firstName} {employee.lastName}</p>
        <p className="text-xl opacity-75">{employee.jobRole}</p>
        <p className="text-xl opacity-75">{employee.workingCountry}</p>
      </div>
    </div>
  );
}
