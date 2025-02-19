import { Resolver, Query, Mutation, Field, ObjectType, Arg, InputType } from "type-graphql";
import Curso from '../../typeorm/entities/Curso';
import CreateCursoService from '../../../services/CreateCursoService';
import UpdateCursoService from '../../../services/UpdateCursoService';
import DeleteCursoService from '../../../services/DeleteCursoService';
import CursosRepository from "../../typeorm/repositories/CursosRepository";
import { getCustomRepository } from "typeorm";
import { container } from "tsyringe";

import ExcelJS from 'exceljs';
import TemporaryFiles from 'tmp';
import path from 'path';

// Preciso usar o DTO
@InputType()
class CriarCursoInput {
    @Field()
    nome: string;
    @Field({ nullable: true })
    descricao: string;
}

@InputType()
class AtualizarCursoInput {
    @Field()
    cursoId: number;
    @Field({ nullable: true })
    nome?: string;
    @Field({ nullable: true })
    descricao?: string;
    @Field({ nullable: true })
    finalizado?: boolean;
}

@ObjectType()
class CursoResponse {
    @Field(() => Curso, { nullable: true })
    curso?: Curso;
}

@Resolver()
export class CursoResolver {
    @Mutation(() => CursoResponse)
    async criarCurso(
        @Arg("options") options: CriarCursoInput
      ): Promise<CursoResponse> {

        const createCurso = new CreateCursoService();
        const curso = await createCurso.execute(options);
        return { curso };

    }
 
    @Query(() => CursoResponse)
    async verCurso(
        @Arg("id") id: number
    ): Promise<CursoResponse> {

        const cursosRepository = getCustomRepository(CursosRepository);
        const curso = await cursosRepository.findById(id);
        return { curso };

    }

    @Mutation(() => CursoResponse)
    async atualizarCurso(
        @Arg("options") options: AtualizarCursoInput
    ): Promise<CursoResponse> {

        const updateCurso = container.resolve(UpdateCursoService);
        const curso = await updateCurso.execute(options);
        return { curso };

    }

    @Mutation(() => Boolean)
    async deletarCurso(
        @Arg("id") id: number
    ): Promise<boolean> {
       
        const deleteCurso = new DeleteCursoService();
        await deleteCurso.execute( { id } );
        return true;
    }

    @Query(() => [Curso])
    async verCursos(): Promise<Curso[]> {

        const cursosRepository = getCustomRepository(CursosRepository);
        const cursos = await cursosRepository.findAll();
        return cursos;

    }

    @Query(() => String)
    async exportarCursos() : Promise<string> {
        const cursosRepository = getCustomRepository(CursosRepository);
        const cursos = await cursosRepository.findAll();

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Abrigos');
        worksheet.columns = [
            { header: 'ID', key: 'id' },
            { header: 'Nome', key: 'nome' },
            { header: 'Descrição', key: 'descricao' }
        ];

        worksheet.addRows(cursos);
        const file = TemporaryFiles.fileSync({postfix: '.xlsx'});
        await workbook.xlsx.writeFile(file.name);
        const filename = path.basename(file.name);
        const url = `/download?filename=${filename}`;

        return url;
    }
}