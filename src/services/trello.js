import path from 'path';

class TrelloSvc {
  static async indexConnector(req, res) {
    const filePath = './static/pages/trello/index-connector.html';
    const resolvedPath = path.resolve(filePath);
    return res.sendFile(resolvedPath);
  }
}

export default TrelloSvc;
