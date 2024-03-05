//post.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { getModelToken } from '@nestjs/mongoose';
import { Post } from './post.model'; // Import the Post model from the appropriate module

describe('PostsService', () => {
  let service: PostsService;
  let postModel: any; // Add this line to declare the postModel variable

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: getModelToken('Post'),
          useValue: {}, // Provide a mock value for the model
        },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
    postModel = module.get(getModelToken('Post')); // Add this line to get the postModel instance
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Add more tests as needed for service methods
  
  describe('getAllPosts', () => {
    it('should return array of posts', async () => {
      const expectedResult = [{ title: 'Post 1', content: 'Content 1' }];
      postModel.find.mockResolvedValue(expectedResult);
      const result = await service.getAllPosts();
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getPost', () => {
    it('should return a post by id', async () => {
      const postId = 'example_id';
      const expectedResult = { _id: postId, title: 'Post 1', content: 'Content 1' };
      postModel.findById.mockResolvedValue(expectedResult);
      const result = await service.getPost(postId);
      expect(result).toEqual(expectedResult);
    });

    it('should throw NotFoundException if post is not found', async () => {
      const postId = 'non_existing_id';
      postModel.findById.mockResolvedValue(null);
      await expect(() => service.getPost(postId)).toThrow('Publicación no encontrada');
    });
  });

  describe('createPost', () => {
    it('should create a new post', async () => {
      const postData = { title: 'New Post', content: 'New Content' };
      const expectedResult = { _id: 'new_id', ...postData };
      postModel.prototype.save.mockResolvedValue(expectedResult);
      const result = await service.createPost(postData);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('updatePost', () => {
    it('should update a post', async () => {
      const postId = 'example_id';
      const postData = { title: 'Updated Post', content: 'Updated Content' };
      const existingPost = { _id: postId, title: 'Original Post', content: 'Original Content' };
      const expectedResult = { ...existingPost, ...postData };
      postModel.findById.mockResolvedValue(existingPost);
      postModel.findByIdAndUpdate.mockResolvedValue(expectedResult);
      const result = await service.updatePost(postId, postData);
      expect(result).toEqual(expectedResult);
    });

    it('should throw NotFoundException if post is not found', async () => {
      const postId = 'non_existing_id';
      const postData = { title: 'Updated Post', content: 'Updated Content' };
      postModel.findById.mockResolvedValue(null);
      await expect(() => service.updatePost(postId, postData)).toThrow('Publicación no encontrada');
    });
  });

  describe('deletePost', () => {
    it('should delete a post', async () => {
      const postId = 'example_id';
      await service.deletePost(postId);
      expect(postModel.findByIdAndDelete).toHaveBeenCalledWith(postId);
    });
  });
});
