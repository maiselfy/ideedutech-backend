import { BadRequestException } from '@nestjs/common';
import { PaginationDTO } from 'src/models/PaginationDTO';

export default function pagination(paginationDTO: PaginationDTO) {
  paginationDTO.qtd = '5';
  if (paginationDTO.page && paginationDTO.qtd) {
    const page = Number(paginationDTO.page);
    const qtd = Number(paginationDTO.qtd);
    const skippedItems = (page - 1) * qtd;
    return [page, qtd, skippedItems];
  } else {
    throw new BadRequestException(
      'Erro na listagem, verifique os parâmetros de paginação.',
    );
  }
}
