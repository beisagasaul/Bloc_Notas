import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Note } from './entities/note.entity';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private readonly noteRepository: Repository<Note>,
  ) {}

  //crea nota
  async create(createNoteDto: CreateNoteDto): Promise<Note> {
    const note = this.noteRepository.create(createNoteDto);
    return await this.noteRepository.save(note);
  }
  //Listar notas
  async findAll(): Promise<Note[]> {
    return await this.noteRepository.find({
      order: { created_at: 'DESC' },
    });
  }
  //Busacar una nota
  async findOne(id: number): Promise<Note> {
    const note = await this.noteRepository.findOne({ where: { id } });

    if (!note) {
      throw new NotFoundException(`Note with id ${id} not found`);
    }

    return note;
  }
  //actualizar
  async update(id: number, updateNoteDto: UpdateNoteDto): Promise<Note> {
    const note = await this.noteRepository.preload({
      id,
      ...updateNoteDto,
    });

    if (!note) {
      throw new NotFoundException(`Note with id ${id} not found`);
    }

    return await this.noteRepository.save(note);
  }
  //Eliminar
  async remove(id: number): Promise<void> {
    const result = await this.noteRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Note with id ${id} not found`);
    }
  }
}
