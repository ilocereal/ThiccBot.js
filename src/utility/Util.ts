import {
    CategoryChannel,
    Channel,
    DiscordAPIError,
    Guild,
    GuildMember,
    Message, PermissionOverwrites,
    PermissionResolvable,
    Permissions, Role,
    TextBasedChannel, TextChannel
} from "discord.js";
import {debug} from "../events/onMessage";


/**
 * Returns a random selection from a range of numbers.
 *
 * @param {number} [min=0] - Optional start range.
 * @param {number} range - Max range.
 * @returns {number} - Random choice within range
 */
export function random(min : number | any[] = 0, range ?: number) : number | any {
    if (typeof min === 'number' && range){
        if (!min){
            return Math.floor(Math.random() * range);
        }
        return Math.floor(Math.random() * (min - range + 1)) + min
    }
    else if (min instanceof Array){
        return min[Math.floor(Math.random() * min.length)];
    }
}

export function capitalize(word: string){
    return word.replace(/^./, word => word[0].toUpperCase() + word.slice(1));
}

export function randBool() : boolean{
    return Math.random () >= 0.5;
}

export function isMissingMessagingPermissions(member: GuildMember, channel: Channel): undefined | PermissionResolvable[] {
    const userPermissions: Permissions = member.permissionsIn(channel);
    const requirements: PermissionResolvable[] = ['SEND_MESSAGES', 'EMBED_LINKS'];
    if (userPermissions.has(requirements)){
        return;
    }
    else {
        return userPermissions.missing(requirements)
    }
}

export function channelOverrideDeniesRolePermission(channel: Channel, role: Role, permission: PermissionResolvable): boolean {
    const resolvedPerm = Permissions.resolve(permission);
    if (!(channel instanceof CategoryChannel)){
        throw new Error(`${channel} is not a text channel`);
    }
    return Boolean(channel.permissionOverwrites.find(
        (permission: PermissionOverwrites) => permission.id === role.id && ((permission.deny & resolvedPerm) === resolvedPerm)
        )
    );
}
export function pluralize(word : string, number: number) : string | -1 {
    if (number > 1 || number === 0){
        return word + 's';
    }
    else if (number === 1){
        return word;
    }
    return -1;
}


export interface ITime {
    s: number;
    m: number;
    h: number;
    d: number;
    w?: number;
}


export function formatTime(seconds : number) : ITime {
    let moduloSeconds: number = Math.floor(seconds % 60);
    let minutes: number = Math.floor(seconds / 60);
    let moduloMinutes: number = Math.floor(minutes % 60);
    let hours: number = Math.floor(minutes / 60);
    let moduloHours: number = Math.floor(hours % 24);
    let days: number = Math.floor(hours / 24);

    // I know this is disgusting but it's 7 am and I just wanna
    // commit some updates ok don't judge me
    if (seconds < 60)
        return  {
            s: seconds,
            m: 0,
            h: 0,
            d: 0
        };
    else if (minutes < 60) {
        return {
            s: moduloSeconds,
            m: minutes,
            h: 0,
            d: 0
        };
    }
    else if (hours < 24) {
        return {
            s: moduloSeconds,
            m: moduloMinutes,
            h: hours,
            d: 0
        };
    }
    else {
        return {
            s: moduloSeconds,
            m: moduloMinutes,
            h: moduloHours,
            d: days
        };
    }
}

export function formattedTimeString(sec: number): string{
    const currentUptime = formatTime(sec);
    const seconds = currentUptime.s;
    const minutes = currentUptime.m;
    const hours = currentUptime.h;
    const days= currentUptime.d;

    return `${days 
        ? days.toFixed(0) + 'd' : ''} ${hours 
        ? hours.toFixed(0) + 'h' : ''} ${minutes 
        ? minutes.toFixed(0) + 'm' : ''} ${seconds 
        ? seconds.toFixed(0) + 's' : ''}`.trim();
}

export function sanitizeUserInput(input: string){
    return input.replace('@', '\`@\`');
}

export function subtractArrays(first: any[], second: any[]): any[] | undefined {
    let differences: any = [];
    first.forEach((value: any)=> {
        const target: any[] = second.filter((secondVal: any) => {
            return secondVal === value;
        });
        if (!target.length)
            differences.concat(value);
    });
    return differences;
}

export function getOnOff(input: string): boolean | undefined {
    if (input === 'on')
        return true;
    else if (input === 'off')
        return false;
    else
        return undefined;
}
