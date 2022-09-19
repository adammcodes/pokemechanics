export default function List({ endpoint, items }) {
  // console.log(items);
  const listItems = items.results ? items.results.map((item, i) => <li key={i}>{item.name || item.url }</li>) : "No results found...";
  
  
  return (
    <section>
      <div>{ !items && "No endpoint selected..." }</div>
      <div>{ items && `${endpoint.toString()} list...`}</div>
      <ul>
        {listItems}
      </ul>
    </section>
  )
}