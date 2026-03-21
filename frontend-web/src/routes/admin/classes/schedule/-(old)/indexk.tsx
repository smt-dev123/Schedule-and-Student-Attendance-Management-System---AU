import { createFileRoute } from "@tanstack/react-router"


export const Route = createFileRoute('/admin/schedule/indexk')({
  component: RouteComponent,
})


function RouteComponent() {
  const scheduleData = [
    {
      session: 'Session 1\n6:00pm-7:30pm',
      monday: {
        subject: 'Mobile Programming II\nlab Session 1',
        teacher: 'ឧ. ជិន ជីម',
        phone: '093 771 244'
      },
      tuesday: {
        subject: 'Mobile Programming II\nlab Session 1',
        teacher: 'ឧ. ជិន ជីម',
        phone: '093 771 244'
      },
      wednesday: {
        subject: 'Advanced Web App with ASP.Net\nMVC Core (lab Session 1)',
        teacher: 'ឧ. ហេង សុភ័ក្រ្ដ',
        phone: '061 227 933'
      },
      thursday: {
        subject: 'Research Methodology\n(IT + CS)',
        teacher: 'ឧ. រ៉ាហ៊ែល សុភ័ក្រ្ដ',
        phone: '092 915 552'
      },
      friday: {
        subject: 'Routing and Switching\nEssentials (IT + CS)\nlab Session 1',
        teacher: 'ឧ. ចំរើន សារ៉ាត់',
        phone: '010 938 238'
      },
      saturday: 'Self-study'
    },
    {
      session: 'Session 2\n7:45pm-9:15pm',
      monday: {
        subject: 'Mobile Programming II',
        teacher: 'ឧ. ជិន ជីម',
        phone: '093 771 244'
      },
      tuesday: {
        subject: 'Mobile Programming II',
        teacher: 'ឧ. ជិន ជីម',
        phone: '093 771 244'
      },
      wednesday: {
        subject: 'Advanced Web App with ASP.Net\nMVC Core',
        teacher: 'ឧ. ហេង សុភ័ក្រ្ដ',
        phone: '061 227 933'
      },
      thursday: {
        subject: 'Research Methodology\n(IT + CS)',
        teacher: 'ឧ. រ៉ាហ៊ែល សុភ័ក្រ្ដ',
        phone: '092 915 552'
      },
      friday: {
        subject: 'Routing and Switching\nEssentials (IT + CS)\nlab Session 1',
        teacher: 'ឧ. ចំរើន សារ៉ាត់',
        phone: '010 938 238'
      },
      saturday: 'Self-study'
    }
  ];

  return (
    <div>
      <h2>កាលវិភាគសិក្សា</h2>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Sessions/ម៉ោង</th>
            <th>ច័ន្ទ</th>
            <th>អង្គារ</th>
            <th>ពុធ</th>
            <th>ព្រហស្បតិ៍</th>
            <th>សុក្រ</th>
            <th>សៅរ៍</th>
          </tr>
        </thead>
        <tbody>
          {scheduleData.map((row, index) => (
            <tr key={index}>
              <td>{row.session}</td>
              {[row.monday, row.tuesday, row.wednesday, row.thursday, row.friday].map((day, i) => (
                <td key={i}>
                  <strong>{day.subject}</strong><br />
                  {day.teacher}<br />
                  {day.phone}
                </td>
              ))}
              <td>{row.saturday}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}