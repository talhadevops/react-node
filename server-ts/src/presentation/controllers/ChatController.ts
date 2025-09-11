import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import {
  CreateRoomUseCase,
  UpdateRoomUseCase,
  GetRoomsUseCase,
  GetRoomUseCase,
  DeleteRoomUseCase,
  JoinRoomUseCase,
  LeaveRoomUseCase,
  InviteUsersUseCase,
  GetRoomMembersUseCase,
  RemoveMemberUseCase
} from '@application/use-cases/chat';
import {
  CreateMessageUseCase,
  UpdateMessageUseCase,
  GetMessagesUseCase,
  DeleteMessageUseCase
} from '@application/use-cases/chat';
import { SocketService } from '@infrastructure/external-services/SocketService';
import { CreateMessageRequestDto } from '@application/dtos/chat.dto';
import { ApiResponse, UUID } from '@shared/types/common.types';
import { HTTP_STATUS } from '@shared/constants';
import { ValidationException } from '@shared/exceptions';

export class ChatController {
  constructor(
    // Room use cases
    private readonly createRoomUseCase: CreateRoomUseCase,
    private readonly updateRoomUseCase: UpdateRoomUseCase,
    private readonly getRoomsUseCase: GetRoomsUseCase,
    private readonly getRoomUseCase: GetRoomUseCase,
    private readonly deleteRoomUseCase: DeleteRoomUseCase,
    private readonly joinRoomUseCase: JoinRoomUseCase,
    private readonly leaveRoomUseCase: LeaveRoomUseCase,
    private readonly inviteUsersUseCase: InviteUsersUseCase,
    private readonly getRoomMembersUseCase: GetRoomMembersUseCase,
    private readonly removeMemberUseCase: RemoveMemberUseCase,
    // Message use cases
    private readonly createMessageUseCase: CreateMessageUseCase,
    private readonly updateMessageUseCase: UpdateMessageUseCase,
    private readonly getMessagesUseCase: GetMessagesUseCase,
    private readonly deleteMessageUseCase: DeleteMessageUseCase,
    // Socket service
    private readonly socketService: SocketService
  ) {}

  // Room endpoints
  public async createRoom(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ValidationException('Validation failed', errors.array().map(err => err.msg));
      }

      const userId = (req as any).user.id;
      const result = await this.createRoomUseCase.execute(req.body, userId);

      const response: ApiResponse = {
        success: true,
        data: result,
        message: 'Room created successfully',
      };

      res.status(HTTP_STATUS.CREATED).json(response);
    } catch (error) {
      next(error);
    }
  }

  public async getRooms(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const sortBy = (req.query.sortBy as string) || 'updated_at';
      const sortOrder = (req.query.sortOrder as 'asc' | 'desc') || 'desc';
      const userId = (req as any).user.id;

      const result = await this.getRoomsUseCase.execute({ page, limit, sortBy, sortOrder }, userId);

      const response: ApiResponse = {
        success: true,
        data: result,
        message: 'Rooms retrieved successfully',
      };

      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  public async getRoom(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const roomId = req.params.id as UUID;
      const userId = (req as any).user.id;

      const result = await this.getRoomUseCase.execute(roomId, userId);

      const response: ApiResponse = {
        success: true,
        data: result,
        message: 'Room retrieved successfully',
      };

      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  public async updateRoom(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ValidationException('Validation failed', errors.array().map(err => err.msg));
      }

      const roomId = req.params.id as UUID;
      const userId = (req as any).user.id;

      const result = await this.updateRoomUseCase.execute(roomId, req.body, userId);

      const response: ApiResponse = {
        success: true,
        data: result,
        message: 'Room updated successfully',
      };

      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  public async deleteRoom(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const roomId = req.params.id as UUID;
      const userId = (req as any).user.id;

      await this.deleteRoomUseCase.execute(roomId, userId);

      const response: ApiResponse = {
        success: true,
        data: null,
        message: 'Room deleted successfully',
      };

      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  public async joinRoom(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const roomId = req.params.id as UUID;
      const userId = (req as any).user.id;

      const result = await this.joinRoomUseCase.execute(roomId, userId);

      const response: ApiResponse = {
        success: true,
        data: result,
        message: 'Joined room successfully',
      };

      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  public async leaveRoom(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const roomId = req.params.id as UUID;
      const userId = (req as any).user.id;

      await this.leaveRoomUseCase.execute(roomId, userId);

      const response: ApiResponse = {
        success: true,
        data: null,
        message: 'Left room successfully',
      };

      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  public async inviteUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ValidationException('Validation failed', errors.array().map(err => err.msg));
      }

      const roomId = req.params.id as UUID;
      const userId = (req as any).user.id;
      const { userIds } = req.body;

      const result = await this.inviteUsersUseCase.execute(roomId, { userIds }, userId);

      // Broadcast invite notifications via socket
      for (const invitedUser of result.invitedUsers) {
        this.socketService.notifyUserInvited({
          userId: invitedUser.id,
          roomId,
          invitedBy: {
            id: userId,
            username: (req as any).user.username,
          },
        });
      }

      const response: ApiResponse = {
        success: true,
        data: result,
        message: `Successfully invited ${result.invitedUsers.length} user(s) to the room`,
      };

      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  public async getRoomMembers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const roomId = req.params.roomId as UUID;
      const userId = (req as any).user.id;

      const result = await this.getRoomMembersUseCase.execute(roomId, userId);

      const response: ApiResponse = {
        success: true,
        data: result,
        message: 'Room members retrieved successfully',
      };

      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  public async removeMember(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const roomId = req.params.roomId as UUID;
      const memberIdToRemove = req.params.memberId as UUID;
      const userId = (req as any).user.id;

      await this.removeMemberUseCase.execute(roomId, memberIdToRemove, userId);

      const response: ApiResponse = {
        success: true,
        message: 'Member removed successfully',
      };

      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  // Message endpoints
  public async createMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ValidationException('Validation failed', errors.array().map(err => err.msg));
      }

      const roomId = req.params.roomId as UUID;
      const userId = (req as any).user.id;
      const username = (req as any).user.username;

      const messageData = {
        ...req.body,
        roomId,
      };

      const result = await this.createMessageUseCase.execute(messageData, userId);

      // Broadcast new message via socket to all users
      this.socketService.broadcastNewMessage({
        message: {
          ...result.message,
          author: {
            id: userId,
            username,
            avatarUrl: (req as any).user.avatarUrl || '',
          },
        },
        roomId,
      });

      const response: ApiResponse = {
        success: true,
        data: result,
        message: 'Message created successfully',
      };

      res.status(HTTP_STATUS.CREATED).json(response);
    } catch (error) {
      next(error);
    }
  }

  public async getMessages(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const roomId = req.params.roomId as UUID;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const userId = (req as any).user.id;

      const result = await this.getMessagesUseCase.execute(roomId, { page, limit }, userId);

      const response: ApiResponse = {
        success: true,
        data: result,
        message: 'Messages retrieved successfully',
      };

      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  // Socket handler for real-time message creation
  public async handleCreateMessage(
    data: CreateMessageRequestDto,
    userId: UUID,
    username: string,
    avatarUrl: string
  ): Promise<void> {
    try {
      const result = await this.createMessageUseCase.execute(data, userId);

      // Broadcast new message via socket to all users
      this.socketService.broadcastNewMessage({
        message: {
          ...result.message,
          author: {
            id: userId,
            username,
            avatarUrl: avatarUrl || '',
          },
        },
        roomId: data.roomId,
      });
    } catch (error) {
      console.error('Error in handleCreateMessage:', error);
      throw error;
    }
  }

  public async updateMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ValidationException('Validation failed', errors.array().map(err => err.msg));
      }

      const messageId = req.params.messageId as UUID;
      const roomId = req.params.roomId as UUID;
      const userId = (req as any).user.id;

      const result = await this.updateMessageUseCase.execute(messageId, req.body, userId);

      // Broadcast message update via socket
      this.socketService.broadcastMessageUpdate({
        messageId,
        content: result.message.content,
        roomId,
      });

      const response: ApiResponse = {
        success: true,
        data: result,
        message: 'Message updated successfully',
      };

      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  public async deleteMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const messageId = req.params.messageId as UUID;
      const roomId = req.params.roomId as UUID;
      const userId = (req as any).user.id;

      await this.deleteMessageUseCase.execute(messageId, userId);

      // Broadcast message deletion via socket
      this.socketService.broadcastMessageDelete({
        messageId,
        roomId,
      });

      const response: ApiResponse = {
        success: true,
        data: null,
        message: 'Message deleted successfully',
      };

      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }
}
