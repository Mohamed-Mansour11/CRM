import * as bcrypt from 'bcrypt';
export const hash = async (data: string, saltOrRounds: number) => {
  return await bcrypt.hash(data, saltOrRounds);
};
