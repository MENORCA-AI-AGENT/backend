import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';

/**
 * Response returned after a user account deletion request.
 *
 * Decision: the response is intentionally small because account deletion is a
 * privacy operation and should not return deleted profile details.
 */
export class DeleteAccountResponseDto {
  @ApiProperty({ example: true })
  @IsBoolean()
  deleted!: boolean;

  @ApiProperty({
    example:
      'Account deletion requested. The current access token may remain valid until it expires.',
  })
  @IsString()
  message!: string;
}
