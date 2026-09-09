import { Table } from 'react-bootstrap';

const ItemTable = ({ items, apiUrl }) => {
 
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Price</th>
          <th>Descriptions</th>
          <th>Images</th>
        </tr>
      </thead>
      <tbody>
        {items.map(item => (
          <tr key={item.itemId}>
            <td>{item.itemId}</td>
            <td>{item.name}</td>
            <td>{item.price} NOK</td>
            <td>{item.description}</td>
            <td><img src={`${apiUrl}${item.imageUrl}`} alt={item.name} width="120" /></td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default ItemTable;
