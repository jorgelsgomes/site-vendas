
import { useState } from 'react';
import './Tabela.css';


const FreteCalculator = () => {
  const [toPostalCode, setToPostalCode] = useState('');
  const [shipmentResult, setShipmentResult] = useState(null);

  const handleCalculateShipment = () => {
    const options = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5NTYiLCJqdGkiOiJkNzQyYTBhMmQ2Y2NmOTE0NDg3NzYwZGZiMDg3OTZiNGY1ODhjZjYxN2UyNDgyNmYzMDM3OTg1NWI0YTAwMWUyNzliMzAzZTYwMmIxNTg1OCIsImlhdCI6MTcwOTQzMzA1Ny4wNDgwODcsIm5iZiI6MTcwOTQzMzA1Ny4wNDgwOSwiZXhwIjoxNzQwOTY5MDU3LjAzOTM1OCwic3ViIjoiOWI3ODc1NzgtNjY1ZS00ZGY0LWEyOGMtODc0ZDNiZjBmNzFlIiwic2NvcGVzIjpbInNoaXBwaW5nLWNhbGN1bGF0ZSJdfQ.AxbwNiW0jbm3C4BnsVJkD_gElIiCaIdUiND406TBhYaNUfZagqmG2uR390SOhNaXEmDiZHAlzlRK2LphjC2d_Sw5j85yv0vrCMaGpIYxkySc5DJHNfg7D4SluEIJzEG8pByDz8uWczVfAc_FWE2o3moiZDAuKYqNSWr8_Ze_KwP8xUGK3bkAVJGKn2Qzt_SPacXfXawJCIP5OYY2TCRQTZWxN-rF24iWnKGWQABiEoemRmwowlHKEigGn0Easq_LrJJmpJ4z11NwL6Q50KtbQXgGId8v5fWNbED2h39a39Ba2yjEDlxwBB93hid9toGp1TGkOprIgU_l1Wc9SkMFLSJZ5RfB-jBiz9A3B7bXV-fENcxaYB-EYHdOOQElZ7phvtiCr8yHU_ikXwcS9TSMat-D2GxcyGGS9iiemfM0bEg3D1GNoo-jn_-QTkaHxQ1A1ednp0MHIefeBeESkoXpaxWCpI3NZ8CmOq3iJsHdBshpMaKCosl6MrbinDaluKC672ezTRoWndMuu8cl9v5ol92M405cI00VVmZKp9BKnUUk6d7JPPYcUjsWn3PUhFFdjX-Z_O5SOlQOlDaKum_cqlPazYeL_CR1ZiTkyyAArFo66gPV0XBPR0YdMI_qQps2-MfCelZJpQn2yfoNdpNGHVZWGZ2u-4pHjI_LWIDgrzE',
        'User-Agent': 'Aplicação jorge.gomes6793@gmail.com',
      },
      body: JSON.stringify({
        from: { postal_code: '56300700' },
        to: { postal_code: toPostalCode },
        package: { height: 4, width: 12, length: 17, weight: 0.3 },
      }),
    };

    fetch('https://sandbox.melhorenvio.com.br/api/v2/me/shipment/calculate', options)
      .then(response => response.json())
      .then(response => setShipmentResult(response))
      .catch(err => console.error(err));
  };

  return (
    <div>
      <label htmlFor="toPostalCode">CEP de Destino: </label>
      <input
        className='cep-input'
        type="text"
        id="toPostalCode"
        placeholder="Digite o CEP de destino"
        value={toPostalCode}
        onChange={(e) => setToPostalCode(e.target.value)}
      />
      <button className='cart-button busca-button' onClick={handleCalculateShipment}>Calcular Envio</button>

      {shipmentResult && (
        <div className='table-container'>
          <h2>Resultado do Envio:</h2>
          <table className='table'>
            <thead>
              <tr>
                <th scope="col">TRANSPORTADORA</th>
                <th scope="col">MODALIDADE</th>
                <th scope="col">PRAZO</th>
                <th scope="col">PREÇO</th>
              </tr>
            </thead>

            {
              shipmentResult.map((company) => (
                <tbody key={company.id}>
                  <tr>
                    <th scope="row">{company.company.name}</th>
                    <th scope='row'>{company.name}</th>
                    <td>{company.delivery_time}<span> dias</span></td>
                    <td>{company.currency} {company.price}</td>
                  </tr>
                </tbody>
              ))
            }

          </table>

        </div>
      )}
    </div>
  );
};

export default FreteCalculator;
